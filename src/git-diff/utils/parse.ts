const fileRegex = /^diff --git a\/(.+) b\/(.+)$/m;
const diffRegex = /^@@ -(?:\d+)(?:,\d+)? \+(\d+)(?:,?)(\d+)? @@/m;

export interface Patch {
  lineNumber: number,
  line: string
}

export const parse = (input: string) => {
  const diffLines = input.split('\n');
  const diff = [];
  const patch: Patch[] = []

  let fileName = "";
  let lineNumber = 0;
  let until = 0

  for (const line of diffLines) {
    const fileMatch = line.match(fileRegex);
    const diffMatch = line.match(diffRegex);

    if (fileMatch) {
      fileName = fileMatch[2];
    } else if (diffMatch) {
      lineNumber = parseInt(diffMatch[1], 10);
      until = diffMatch[2] ? parseInt(diffMatch[2]) : 1;
    } else if (until > 0) {
      if (!line.startsWith('-')) {  // deleted code seems to confuse the model
        patch.push({ lineNumber, line });
        lineNumber++;
        until--;
      }
      if(until == 0) {
        diff.push({fileName, patch: [...patch]})
        patch.length = 0;
      }
    }
  }

  return diff;
}
