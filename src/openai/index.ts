import { type Diff } from "../git-diff";
import { makeReview, roomForReview } from "./utils/make-review";
import { messageManager } from "./utils/message-manager";

export const run = async (input: Diff[]) => {
  for (const diff of input) {
    const messages = messageManager(diff);
    if(!roomForReview()) break;

    if(messages.length == 1) continue;

    await makeReview(messages);
  }
}
