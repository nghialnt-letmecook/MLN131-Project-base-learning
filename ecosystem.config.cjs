module.exports = {
  apps: [
    {
      name: "tutuonghcm",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: ".env",
      merge_logs: true,
      time: true,
    },
  ],
};
