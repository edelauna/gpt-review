import type { Diff } from "../../git-diff";
import type OpenAI from 'openai';
import { encode } from 'gpt-3-encoder';
import { functions } from "./make-review";

const countTokens = (input:string | null) => input ? encode(input).length : 0

const MAX_TOKENS = (16_385 / 7 * 6) - countTokens(JSON.stringify(functions))

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a code peer reviewer, your role is to provide valuable feedback on Github Pull Requests. Your default response is to simply review the changes with 'Looks Good to Me' (LGTM) unless there are critical issues. Please quickly review each code change and consider any defects, quality improvements, or suggest alternative solutions. Line mapping of the incoming code:\n* Lines beginning with '+' signify new lines\n* Lines beginning with '-' signify removed lines\n* all other lines are provided for context."
  }
]

let currentToken = countTokens(messages[0].content);

const _cycler = (nextToken: number) => {
  while(messages.length > 2 && (nextToken + currentToken) > MAX_TOKENS) {
    const prevToKeNs = countTokens(messages[1].content)
    messages.splice(1,1);
    currentToken -= prevToKeNs
  }
}

const _append = (nextToken: number, message: OpenAI.Chat.Completions.ChatCompletionMessageParam) => {
  if((nextToken + currentToken) < MAX_TOKENS) {
    messages.push(message)
    currentToken += nextToken
  }
}

export const messageManager = (input: Diff) => {
  const candidate = JSON.stringify(input)
  const nextToken = countTokens(candidate)
  _cycler(nextToken);
  _append(nextToken, {
    role: "user",
    content: candidate
  })
  return messages
}

export const recordResponse = (functionName: string) => {
  const message: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: "function", name: functionName, content: "OK"}
  const nextToken = countTokens(JSON.stringify(message));
  _cycler(nextToken)
  _append(nextToken, message)
  return messages;
}
