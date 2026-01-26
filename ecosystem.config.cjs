module.exports = {
  apps: [{
    name: "tubeflow",
    cwd: "/root/tubeflow",
    script: "bash",
    args: ["-c", "export PORT=3000 && flox activate doppler run -- yarn dev"],
    env: {
      PORT: 3000
    },
    autorestart: true,
    watch: false
  }]
};
