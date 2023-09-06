import OpenAI from 'openai';
import * as core from '@actions/core';

const REVIEW_LIMIT = 7;
let existingReview = 0;

const openai = new OpenAI({
  apiKey: core.getInput("OPENAI_API_KEY")
})

export const functions = [
  {
    name : "make_critical_review",
    description: "Provide a review of any defects, quality improvements, or suggest an alternative solutions.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title of the review"
        },
        message: {
          type: "string",
          description: "Review message using markdown formatting."
        },
        file: {
          type: "string",
          description: "Filename the review relates too"
        },
        line: {
          type: "number",
          description: "The starting line for which the review relates."
        },
        endLine: {
          type: "number",
          description: "The end line for which the review relates."
        }
      },
      required: ["title", "file", "line", "message"]
    }
  }, {
    name : "make_review",
    description: "LGTM",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "LGTM"
        }
      }
    }
  }
]

export const makeReview = async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
  const response = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo-16k",
    functions: functions,
    function_call: 'auto'
  })
  _makeReview(response)
}

const _makeReview = (response: OpenAI.Chat.Completions.ChatCompletion, choice = 0) => {
  try {
    if(response.choices.length <= choice) return

    const message = response.choices[choice].message
    if(!message.function_call) return
    if(message.function_call.name != functions[0].name) return

    const {title, file, line, endLine, message: review} = JSON.parse(message.function_call.arguments)
    core.notice(review, {title, file, startLine: line, endLine})
    existingReview++;
  } catch {
    if(choice < 3) _makeReview(response, choice + 1)
  }
}

export const roomForReview = () => existingReview < REVIEW_LIMIT
