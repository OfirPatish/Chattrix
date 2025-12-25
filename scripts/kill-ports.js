#!/usr/bin/env node

/**
 * Kill processes running on ports 3000 and 3001
 * Cross-platform script using Node.js
 */

import { execSync } from 'child_process';
import { platform } from 'os';

const ports = [3000, 3001];
const isWindows = platform() === 'win32';

const killPort = (port) => {
  try {
    if (isWindows) {
      // Windows: Find process using port and kill it
      const findProcess = `netstat -ano | findstr ":${port}" | findstr "LISTENING"`;
      const output = execSync(findProcess, { encoding: 'utf-8' });
      
      if (output.trim()) {
        const lines = output.trim().split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) {
            pids.add(match[1]);
          }
        });
        
        pids.forEach(pid => {
          try {
            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            console.log(`✅ Killed process ${pid} on port ${port}`);
          } catch (err) {
            // Process might already be dead
          }
        });
      } else {
        console.log(`ℹ️  No process found on port ${port}`);
      }
    } else {
      // Unix/Linux/Mac: Find and kill process
      const findProcess = `lsof -ti:${port}`;
      try {
        const pid = execSync(findProcess, { encoding: 'utf-8' }).trim();
        if (pid) {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
          console.log(`✅ Killed process ${pid} on port ${port}`);
        }
      } catch (err) {
        console.log(`ℹ️  No process found on port ${port}`);
      }
    }
  } catch (error) {
    // Port might not be in use
    console.log(`ℹ️  Port ${port} is free`);
  }
};

console.log('🔍 Checking ports 3000 and 3001...\n');

ports.forEach(port => {
  killPort(port);
});

console.log('\n✅ Done! Ports should be free now.');

