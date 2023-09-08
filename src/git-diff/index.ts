import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { type Patch, parse } from './utils/parse';

export interface Diff {
  fileName: string,
  patch: Patch[]
}

class GitDiffBaseRefException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'GitDiffBaseRefException';
  }
}

export const run = async () => {
  const headRef: string | undefined = process.env["GITHUB_HEAD_REF"] || process.env["GITHUB_REF_NAME"]
  const baseRef: string = process.env["GITHUB_BASE_REF"] || core.getInput("TARGET_BRANCH")
  if(!baseRef) throw new GitDiffBaseRefException(`Missing github.base_ref, which is required.
  This is available when the event that triggers a workflow run is a pull_request.
  Alternatively it can be set via the input parameter target_branch.`)

  const fetchArgs = [
    "fetch", "origin", `refs/heads/${baseRef}`
  ]
  const diffArgs = [
    "diff",
    `origin/${baseRef}`,
    "--diff-algorithm=minimal", // should benchmark if it's worth the additional time to produce cleaner diffs
    "--unified=7" // bumping from 3 to seven to pass more context to the model
  ]
  if(headRef) {
    diffArgs[1] = `origin/${baseRef}...origin/${headRef}`
    fetchArgs.splice(2,0, `refs/heads/${headRef}`)
  }
  await exec.exec("git", fetchArgs)
  core.startGroup(`git ${diffArgs.join(" ")}`)
  const {stdout: output} = await exec.getExecOutput("git", diffArgs)
  core.endGroup()
  const patches: Diff[] = parse(output)
  return patches;
}
