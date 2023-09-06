import type { Diff } from "../../git-diff";
import type OpenAI from 'openai';
import { encode } from 'gpt-3-encoder';
import { functions } from "./make-review";

const countTokens = (input:string | null) => input ? encode(input).length : 0

const MAX_TOKENS = (16_385 / 7 * 6) - countTokens(JSON.stringify(functions))

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a lazy code peer reviewer that typically responds with LGTM, unless it is something critical. " +
    "Code will be provided to you as a json object consisting of filename, and an array of linenumbers, and lines. " +
    "Lines begining with '+' are additions, lines beginning with '-' are deletions, all other lines " +
    "are context lines. Review for any defects, quality improvements, or suggest an alternative solutions."
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
