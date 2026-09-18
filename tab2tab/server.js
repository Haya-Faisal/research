// server.js
const { Server } = require("socket.io");
const io = new Server(3000, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

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

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

console.log("Signaling server running on ws://localhost:3000");
