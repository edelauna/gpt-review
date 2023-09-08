import { readFileSync } from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { run } from '.';

const gitDiffInput = () => {
  const fixturePath = path.join(__dirname, './fixtures/git-diff-output.txt');
  return readFileSync(fixturePath, 'utf-8');
}

jest.mock('@actions/core');
jest.mock('@actions/exec', () => ({
  getExecOutput: jest.fn(),
  exec: jest.fn()
}))

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules()
  process.env = { ...OLD_ENV }; // Make a copy
});

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});

test('[integretion] run should execute on pr event', async () => {
  process.env['GITHUB_HEAD_REF'] = 'feature-branch';
  process.env['GITHUB_BASE_REF'] = 'main';

  const mockExec = exec.getExecOutput as jest.Mock
  mockExec.mockResolvedValue({
    stdout: gitDiffInput()
  })
  const output = await run()

  expect(mockExec).toHaveBeenCalledWith('git', [
    'diff',
    'origin/main...origin/feature-branch',
    '--diff-algorithm=minimal',
    '--unified=7',
  ]);
  expect(output.length).toBe(56);
})

test('[integration] run should execute on push event', async () => {
  process.env['GITHUB_HEAD_REF'] = '';
  process.env['GITHUB_REF_NAME'] = 'feature-branch-2';
  process.env['GITHUB_BASE_REF'] = ''
  const mockInput = core.getInput as jest.Mock
  mockInput.mockReturnValue('dev');

  const mockExec = exec.getExecOutput as jest.Mock
  mockExec.mockResolvedValue({
    stdout: gitDiffInput()
  })
  const output = await run()

  expect(mockExec).toHaveBeenCalledWith('git', [
    'diff',
    'origin/dev...origin/feature-branch-2',
    '--diff-algorithm=minimal',
    '--unified=7',
  ]);
  expect(output.length).toBe(56);
})

test('[integration] run should execute without head ref', async () => {
  process.env['GITHUB_HEAD_REF'] = '';
  process.env['GITHUB_REF_NAME'] = '';
  process.env['GITHUB_BASE_REF'] = '';
  const mockInput = core.getInput as jest.Mock
  mockInput.mockReturnValue('dev');

  const mockExec = exec.getExecOutput as jest.Mock
  mockExec.mockResolvedValue({
    stdout: gitDiffInput()
  })
  const output = await run()

  expect(mockExec).toHaveBeenCalledWith('git', [
    'diff',
    'origin/dev',
    '--diff-algorithm=minimal',
    '--unified=7',
  ]);
  expect(output.length).toBe(56);
})

test('[integration] run should throw on push without input', async () => {
  process.env['GITHUB_REF_NAME'] = 'feature-branch-2';
  process.env['GITHUB_BASE_REF'] = '';
  const mockInput = core.getInput as jest.Mock
  mockInput.mockReturnValue('');

  const mockExec = exec.getExecOutput as jest.Mock
  expect(run()).rejects.toThrow(Error)
  expect(mockExec).toHaveBeenCalledTimes(0)
})
