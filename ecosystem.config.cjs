module.exports = {
  apps: [{
    name: "tubeflow",
    cwd: "/root/tubeflow",
    script: "bash",
    args: ["-c", "export PORT=3004 && flox activate -- yarn dev"],
    env: {
      PORT: 3004
    },
    autorestart: true,
    watch: false
  }]
};
