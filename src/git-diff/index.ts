import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { type Patch, parse } from './utils/parse';

export interface Diff {
  fileName: string,
  patch: Patch[]
}

export const run = async () => {
  const headRef: string | undefined = process.env["GITHUB_HEAD_REF"] || process.env["GITHUB_REF_NAME"]
  const baseRef: string = process.env["GITHUB_BASE_REF"] || core.getInput("TARGET_BRANCH")
  if(!baseRef) throw Error(`Missing github.base_ref, which is required.
  This is available when the event that triggers a workflow run is a pull_request.
  Alternatively it can be set via the input parameter target_branch.
  `)
  const args = [
    "diff",
    baseRef,
    "--diff-algorithm=minimal", // should benchmark if it's worth the additional time to produce cleaner diffs
    "--unified=7" // bumping from 3 to seven to pass more context to the model
  ]
  if(headRef) args.splice(2,0, headRef)
  const {stdout: output} = await exec.getExecOutput("git", args)
  const patches: Diff[] = parse(output)
  return patches;
}
