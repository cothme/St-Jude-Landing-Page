import { spawn } from 'node:child_process';
import { join } from 'node:path';

const apiPort = process.env.DEV_API_PORT || '8080';
const webPort = process.env.DEV_WEB_PORT || '5173';
const viteBin = join('node_modules', 'vite', 'bin', 'vite.js');
const children = [];

startProcess('api', process.execPath, ['server/server.mjs'], {
  PORT: apiPort,
});

startProcess('web', process.execPath, [viteBin, '--configLoader', 'runner', '--host', '127.0.0.1', '--port', webPort], {});

console.log(`Local chat API: http://127.0.0.1:${apiPort}`);
console.log(`Website dev server: http://127.0.0.1:${webPort}`);

function startProcess(label, command, args, extraEnv) {
  const child = spawn(command, args, {
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  children.push(child);
  child.stdout.on('data', (chunk) => writeOutput(label, chunk));
  child.stderr.on('data', (chunk) => writeOutput(label, chunk));
  child.on('error', (error) => {
    console.error(`[${label}] failed to start: ${error.message}`);
    stopAll(child);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (signal) return;
    stopAll(child);
    process.exitCode = code || 0;
  });
}

function writeOutput(label, chunk) {
  for (const line of String(chunk).split(/\r?\n/)) {
    if (line.trim()) {
      console.log(`[${label}] ${line}`);
    }
  }
}

function stopAll(exitingChild) {
  for (const child of children) {
    if (child !== exitingChild && !child.killed) {
      child.kill();
    }
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopAll();
    process.exit(0);
  });
}
