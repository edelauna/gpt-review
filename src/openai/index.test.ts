import * as core from '@actions/core';
import { run } from ".";
import { Diff } from "../git-diff";
import { makeReview, roomForReview } from "./utils/make-review";
import { messageManager } from "./utils/message-manager";

jest.mock('./utils/message-manager', () => ({
  messageManager: jest.fn()
}));
jest.mock('./utils/make-review', () => ({
  makeReview: jest.fn(),
  roomForReview: jest.fn()
}));
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  info: jest.fn()
}))

beforeEach(() => jest.resetAllMocks())

test('run() call messageManager and makeReview for each diff', async () => {
  const input: Diff[] = [
    { fileName: 'file1.diff', patch: [] },
    { fileName: 'file2.diff', patch: [] },
  ];
  const inputMock = core.getInput as jest.Mock
  inputMock.mockReturnValue("")

  const messageManagerMock = messageManager as jest.Mock
  messageManagerMock.mockReturnValueOnce([
    { role: 'system', content: 'System message' },
    { role: 'user', content: 'User message 1' }
  ])
    .mockReturnValueOnce([
      { role: 'system', content: 'System message' },
      { role: 'user', content: 'User message 1' },
      { role: 'user', content: 'User message 2' }
    ]);

  const roomForReviewMock = roomForReview as jest.Mock
  roomForReviewMock.mockReturnValueOnce(true).mockReturnValueOnce(false);

  const makeReviewMock = makeReview as jest.Mock
  await run(input);

  expect(messageManagerMock).toHaveBeenCalledTimes(2);
  expect(makeReviewMock).toHaveBeenCalledTimes(1);
});

test('run() ignores files', async () => {
  const input: Diff[] = [
    { fileName: 'file1.diff', patch: [] },
    { fileName: 'file2.diff', patch: [] },
    { fileName: 'target/file2.diff', patch: [] },
  ];
  const inputMock = core.getInput as jest.Mock
  inputMock.mockReturnValue("file2.diff,target")

  const messageManagerMock = messageManager as jest.Mock
  messageManagerMock.mockReturnValueOnce([
    { role: 'system', content: 'System message' },
    { role: 'user', content: 'User message 1' }
  ])
    .mockReturnValueOnce([
      { role: 'system', content: 'System message' },
      { role: 'user', content: 'User message 1' },
      { role: 'user', content: 'User message 2' }
    ]);

  const roomForReviewMock = roomForReview as jest.Mock
  roomForReviewMock.mockReturnValue(true);

  const makeReviewMock = makeReview as jest.Mock
  await run(input);

  expect(messageManagerMock).toHaveBeenCalledTimes(1);
  expect(makeReviewMock).toHaveBeenCalledTimes(1);
});
