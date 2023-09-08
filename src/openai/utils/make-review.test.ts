import * as core from '@actions/core';
import OpenAI from 'openai'
import parsedMessage from './fixtures/parsed-message.json';
import { makeReview } from './make-review';

const messages:OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
  role: "system",
  content: `You are a code peer reviewer, your role is to provide valuable feedback on Github Pull Requests.
  Your default response is to simply approve the changes with "Looks Good to Me" (LGTM) unless there are critical issues.
  Please thororughly reveiw each code change and consider any defects, quality improvements, or suggest alternative solutions.
  Line mapping of the incoming code:
  * Lines beginning with '+' signify new lines
  * Lines beginning with '-' signify removed lines
  * all other lines are provided for context`
}, {
  role: 'user',
  content: JSON.stringify(parsedMessage)
}]

jest.mock('@actions/core', () => ({
  getInput: jest.fn().mockReturnValue("sk-123"),
  notice: jest.fn()
}));
jest.mock('openai')


beforeEach(() => jest.resetAllMocks())

/**
 * can pass a real sk key as part of the getInput mock, need to comment out jest.mock('openai')
 */
test.skip('[integration] it should call OpenAI', async() => {
  const noticeMock = core.notice as jest.Mock
  await makeReview(messages);
  expect(noticeMock).toHaveBeenCalledTimes(1)
})

test('it should call OpenAI and process a make_critical_review response', async () => {
  const noticeMock = core.notice as jest.Mock
  OpenAI.prototype.chat = {
    completions: {
      create: jest.fn(),
    },
  }as unknown as OpenAI.Chat;
  const mockCreate = OpenAI.prototype.chat.completions.create as jest.Mock;
  mockCreate.mockResolvedValueOnce({
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          function_call: {
            name: "make_critical_review",
            arguments: "{\n  \"title\": \"Fix typo\",\n  \"message\": \"There is a typo on line 17. It should be `core` instead of `corre`.\",\n  \"file\": \"index.ts\",\n  \"line\": 17\n}",
          },
        },
        finish_reason: "function_call",
      },
    ],
  })
  await makeReview(messages);
  expect(noticeMock).toHaveBeenCalledTimes(1)
})

test('it should call OpenAI and process a make_review response', async () => {
  const noticeMock = core.notice as jest.Mock
  OpenAI.prototype.chat = {
    completions: {
      create: jest.fn(),
    },
  }as unknown as OpenAI.Chat;
  const mockCreate = OpenAI.prototype.chat.completions.create as jest.Mock
  mockCreate.mockResolvedValueOnce({
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          function_call: {
            name: "make_review",
            arguments: "{\n  \"message\": \"LGTM\"\n}",
          },
        },
        finish_reason: "function_call",
      },
    ],
  })
  await makeReview(messages);
  expect(noticeMock).toHaveBeenCalledTimes(0)
})
