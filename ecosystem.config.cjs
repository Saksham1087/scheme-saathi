const cp = require('child_process');

/**
 * Synchronously checks and returns the first available port starting from `startPort`.
 * Spawns a lightweight child process to run asynchronous net checks blockingly.
 */
function getAvailablePortSync(startPort = 3001) {
  const script = `
    const net = require('net');
    function checkPort(port) {
      return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => server.close(() => resolve(true)));
        server.listen(port);
      });
    }
    (async () => {
      let port = ${startPort};
      while (!(await checkPort(port))) {
        port++;
      }
      process.stdout.write(String(port));
    })();
  `;
  try {
    const res = cp.spawnSync(process.execPath, [], { input: script, encoding: 'utf-8' });
    return parseInt(res.stdout, 10) || startPort;
  } catch (e) {
    return startPort;
  }
}

const port = getAvailablePortSync(3001);

module.exports = {
  apps: [
    {
      name: "saathi",
      script: "node_modules/vite/bin/vite.js",
      args: ["--host", "0.0.0.0", "--port", String(port)],
      env: {
        NODE_ENV: "development",
        PORT: port
      },
      env_production: {
        NODE_ENV: "production",
        script: "serve",
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: port,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html"
      }
    }
  ]
}
