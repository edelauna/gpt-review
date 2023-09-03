import { wait } from './wait';
import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

test('wait 500 ms', async () => {
  const start = new Date().getTime();
  await wait(500);
  const end = new Date().getTime();
  var delta = Math.abs(end - start);
  expect(delta).toBeGreaterThanOrEqual(500);
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '100';
  const ip = path.join(__dirname, 'index.ts');
  const result = cp.execSync(`npx ts-node ${ip}`, {env: process.env}).toString();
  console.log(result);
})
