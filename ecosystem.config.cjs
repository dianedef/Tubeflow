module.exports = {
  apps: [
    {
      name: "tubeflow-web",
      cwd: "/root/tubeflow",
      script: "bash",
      args: ["-c", "export PORT=3000 && flox activate -- doppler run -- yarn dev"],
      env: {
        PORT: 3000
      },
      autorestart: true,
      watch: false
    },
    {
      name: "tubeflow-convex",
      cwd: "/root/tubeflow/packages/backend",
      script: "bash",
      args: ["-c", "flox activate -- doppler run -- npx convex dev"],
      autorestart: true,
      watch: false
    }
  ]
};
