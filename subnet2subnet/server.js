const express = require("express");
const https = require("https");
const fs = require("fs");
const os = require("os");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("public"));

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const server = https.createServer(options, app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("peer-joined");
  });
  socket.on("offer", (data) => socket.to(data.room).emit("offer", data.offer));
  socket.on("answer", (data) =>
    socket.to(data.room).emit("answer", data.answer),
  );
  socket.on("ice-candidate", (data) =>
    socket.to(data.room).emit("ice-candidate", data.candidate),
  );
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  const nets = os.networkInterfaces();
  console.log(`\nServer running! Open on any device on your subnet:\n`);
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`  https://${net.address}:${PORT}`);
      }
    }
  }
});
