import type { Diff } from "../../git-diff";
import type OpenAI from 'openai';
import { encode } from 'gpt-3-encoder';
import { functions } from "./make-review";

const countTokens = (input:string | null) => input ? encode(input).length : 0

const MAX_TOKENS = (16_385 / 7 * 6) - countTokens(JSON.stringify(functions))

const SYSTEM_MESSAGE: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
  role: "system",
  content: "As a code peer reviewer, your role is to provide valuable feedback on snippets of code for a GitHub Pull Request. Since you wont always be provided the context for the snippet, your default response is to provide a review stating 'Looks Good to Me' (LGTM)."
}

const SYSTEM_HYDRATE_FREQUENCY = 7

const messages = [
  SYSTEM_MESSAGE
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

let responses = 0;

export const recordResponse = (functionName: string) => {
  const message: OpenAI.Chat.Completions.ChatCompletionMessageParam = { role: "function", name: functionName, content: "OK"}
  const nextToken = countTokens(JSON.stringify(message));
  _cycler(nextToken)
  _append(nextToken, message)
  responses++;

  // keep the system instructions fresh in the message history
  if(responses % SYSTEM_HYDRATE_FREQUENCY == 0) addSystemMessage();

  return messages;
}

export const addSystemMessage = () => {
  const nextToken = countTokens(SYSTEM_MESSAGE.content);
  _cycler(nextToken)
  _append(nextToken, SYSTEM_MESSAGE)
}
