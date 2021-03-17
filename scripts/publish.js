const { spawn } = require('child_process');

spawn('cd dist && npm publish --access=public', { stdio: 'inherit', shell: true });
