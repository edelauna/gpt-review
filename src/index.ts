import * as core from '@actions/core';
import * as gitDiff from './git-diff';
import * as makeReview from './openai'

async function run() {
  try {
    const diffs = await gitDiff.run()
    await makeReview.run(diffs);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();
