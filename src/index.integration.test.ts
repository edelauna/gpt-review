import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
interface ExecSyncException extends Error {
  stdout: Buffer
  stderr: Buffer
}

/**
 * Requires `export OPENAI_API_KEY=${your-api-key}` to run
 */
test.skip('[integration] test runs', () => {
  process.env['INPUT_OPENAI_API_KEY'] = process.env['OPENAI_API_KEY'];
  process.env['INPUT_TARGET_BRANCH' ] = 'main';

  const ip = path.join(__dirname, 'index.ts');
  try {
    const result = cp.execSync(`npx ts-node ${ip}`, {env: process.env}).toString();
    console.log(result);
  } catch(err) {
    console.log(err)
    console.log((err as ExecSyncException).stdout.toString())
    console.log((err as ExecSyncException).stderr.toString())
    throw err
  }
})
