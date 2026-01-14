module.exports = {
  apps: [{
    name: "tubeflow",
    cwd: "/root/tubeflow",
    script: "bash",
    args: ["-c", "export PORT=3002 && flox activate -- sh -c 'cd apps/web && yarn dev'"],
    env: {
      PORT: 3002
    },
    autorestart: true,
    watch: false
  }]
};
