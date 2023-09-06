import * as core from '@actions/core';
import * as gitDiff from './git-diff';
import { run } from '.';

jest.mock('./git-diff', () => ({
  run: jest.fn()
}))

beforeEach(() => {
  jest.resetAllMocks();
})

test('run receives GitDiffBaseRefException', async () => {
  const mockWarning = jest.spyOn(core, 'warning');
  const mockRun = gitDiff.run as jest.Mock
  const gitDiffBaseRefException = Error("err")
  gitDiffBaseRefException.name = "GitDiffBaseRefException"
  mockRun.mockRejectedValue(gitDiffBaseRefException)
  await run()

  expect(mockWarning).toHaveBeenCalledTimes(1)
})
