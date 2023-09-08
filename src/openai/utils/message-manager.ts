import type { Diff } from "../../git-diff";
import type OpenAI from 'openai';
import { encode } from 'gpt-3-encoder';
import { functions } from "./make-review";

const countTokens = (input:string | null) => input ? encode(input).length : 0

const MAX_TOKENS = (16_385 / 7 * 6) - countTokens(JSON.stringify(functions))

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `You are a code peer reviewer, your role is to provide valuable feedback on Github Pull Requests.
    Your default response is to simply approve the changes with "Looks Good to Me" (LGTM) unless there are critical issues.
    Please thororughly reveiw each code change and consider any defects, quality improvements, or suggest alternative solutions.
    Line mapping of the incoming code:
    * Lines beginning with '+' signify new lines
    * Lines beginning with '-' signify removed lines
    * all other lines are provided for context`
  }
]

let currentToKeNs = countTokens(messages[0].content);

export const messageManager = (input: Diff) => {
  const candidate = JSON.stringify(input)
  const nextToKeNs = countTokens(candidate)
  while(messages.length > 2 && (nextToKeNs + currentToKeNs) > MAX_TOKENS) {
    const prevToKeNs = countTokens(messages[1].content)
    messages.splice(1,1);
    currentToKeNs -= prevToKeNs
  }
  if((nextToKeNs + currentToKeNs) < MAX_TOKENS) {
    messages.push({
      role: "user",
      content: candidate
    })
    currentToKeNs += nextToKeNs
  }
  return messages
}
