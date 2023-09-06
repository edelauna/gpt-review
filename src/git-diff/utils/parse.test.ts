import { readFileSync } from 'fs';
import * as path from 'path';
import { parse } from './parse';

const gitDiffInput = () => {
  const fixturePath = path.join(__dirname, './fixtures/git-diff-output.txt');
  return readFileSync(fixturePath, 'utf-8');
}

test("parse() should return lines and line number", () => {
  const input = gitDiffInput();
  const output = parse(input);
  expect(output.length).toBe(41);
  expect(output[40].fileName).toBe("wait.ts");
  expect(output[40].patch.length).toBe(5)
})
