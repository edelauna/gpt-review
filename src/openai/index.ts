import * as core from '@actions/core';
import { type Diff } from "../git-diff";
import { makeReview, roomForReview } from "./utils/make-review";
import { messageManager } from "./utils/message-manager";

const ignoreFiles = () => core.getInput("IGNORE_FILES").split(",").filter(f => f != '');

const filesToBeIgnored = (file: string) =>{
  const ignore = ignoreFiles().filter(f => file.startsWith(f));
  const predicate = ignore.length > 0
  if(predicate){
    core.info(`Skipping analysis of patch, ${file} matched the following: ${ignore}`);
  }
  return predicate
}

export const run = async (input: Diff[]) => {
  for (const diff of input) {
    if(filesToBeIgnored(diff.fileName)) continue;

    const messages = messageManager(diff);
    if(!roomForReview()) break;

    if(messages.length == 1) continue;

    await makeReview(messages);
  }
}
