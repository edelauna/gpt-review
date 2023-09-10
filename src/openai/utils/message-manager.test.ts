import diff1 from './fixtures/diff_1.json';
import * as messageManager from './message-manager';
import type OpenAI from 'openai';

beforeEach(() => jest.resetAllMocks());

test('messageManager returns a message', () => {
  const input = diff1
  const output = messageManager.messageManager(input);
  expect(output[1]).toHaveProperty("role")
});

test('messageManager removes messages after max token count reached', () => {
  let output: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  for (let i = 0; i < 50; i++) {
    const input = diff1
    output = messageManager.messageManager(input)
  }
  expect(output.length).toBe(18)
})

test('recordResponse appends function response', () => {
  const functionName = 'testFunction';

  const output = messageManager.recordResponse(functionName);

  // bit hacky since `messages` is a shared object
  expect(output[output.length - 1]).toEqual({
    role: 'function',
    name: functionName,
    content: 'OK',
  })
});

test('recordResponse appends system message after 7th recording', () => {
  const functionName = 'testFunction';
  const mockAddSystemMessage = jest.spyOn(messageManager, 'addSystemMessage')
  for (let i = 0; i < 7; i++) {
    messageManager.recordResponse(functionName)
  }
  expect(mockAddSystemMessage).toHaveBeenCalled()
});
