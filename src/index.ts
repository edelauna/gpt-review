import * as core from '@actions/core';
import * as gitDiff from './git-diff';
import * as makeReview from './openai'

export const run = async () => {
  try {
    const diffs = await gitDiff.run()
    await makeReview.run(diffs);
  } catch (error) {
    switch((error as Error).name) {
      case 'GitDiffBaseRefException':
        core.warning((error as Error).message);
        break;
      default:
        core.setFailed((error as Error).message);
        break;
    }
  }
}

run();
