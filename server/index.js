const express = require("express");
const path = require('path');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, '../build')));
app.all('*', (req, res, next) => res.sendFile(path.join(__dirname, '../build/index.html')));
console.log('dirname', __dirname);
const {
  addUser,
  getUsers,
  estimateUpdate,
  deleteEstimates,
} = require("./users");
const estimate = "-";

io.on("connection", (socket) => {
  socket.on("create", (roomId) => {
    socket.join(roomId);
  });

  socket.on("check-username", ({ username, roomId }) => {
    const users = getUsers(roomId);
    const isExist = users.find((user) => user.name === username) || null;
    console.log(users, isExist);
    if(isExist) {
      socket.emit("already-exist");
    } else {
      addUser(socket.id, username, roomId, estimate);
      socket.join(roomId);
      io.sockets.in(roomId).emit("user-login", getUsers(roomId));
    }
  });

  socket.on("estimate-update", ({ username, number, roomId }) => {
    estimateUpdate(username, number, roomId);
    io.sockets.in(roomId).emit("estimate-updated", getUsers(roomId));
  });

  socket.on("get-users", (roomId) => {
    socket.join(roomId);
    io.sockets.in(roomId).emit("users-list", getUsers(roomId));
  });

  socket.on("delete-estimates", ({ roomId }) => {
    console.log(roomId);
    deleteEstimates(roomId);
    io.sockets.in(roomId).emit("reset-estimates", getUsers(roomId));
  });

  socket.on("show-estimates-emit", ({ roomId }) => {
    io.sockets.in(roomId).emit("show-estimates-on");
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
