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

test('run() call messageManager and makeReview for each diff', async () => {
  const input: Diff[] = [
    { fileName: 'file1.diff', patch: [] },
    { fileName: 'file2.diff', patch: [] },
  ];
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
