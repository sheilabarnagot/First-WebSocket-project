// This code sets up a server-side application using Express and Socket.IO.
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;
const { Chatio } = require("./src/models/diceGame");
const { dbConnection } = require("./src/db/config");

app.use(express.static("public"));

dbConnection();

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  socket.on("user", async (user) => {
    console.log("Enter user");
    const saveUser = await new Chatio({ user: user.myUser });
    saveUser.save();
  });

  socket.on("rollDice", async (data) => {
    console.log("dice rolled" + data.user + " " + data.dice + " " + data.total);
    const saveRolldice = await Chatio.findOne({ user: data.user });
    saveRolldice.games.push(data.dice);
    const total = saveRolldice.games.reduce((acc, value) => acc + value, 0);
    saveRolldice.total = total;
    await saveRolldice.save();
    io.emit("diceRolled", {
      user: data.user,
      dice: data.dice,
      total: data.total,
    });
  });

  socket.on("chatMessage", async (msg) => {
    console.log("Meddelande: " + msg.user + " " + msg.message);
    const saveMessage = await Chatio.updateOne(
      { user: msg.user },
      { $push: { message: msg.message } }
    );
    io.emit("newChatMessage", { user: msg.user, message: msg.message });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

// Endpoint --> mongo
app.get("/users", async (req, res) => {
  try {
    const allUsers = await Chatio.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({
      error: error.allUsers,
    });
  }
});

app.delete("/users", async (req, res) => {
  try {
    const deleteUsers = await Chatio.deleteMany({});
    return res.status(200).json(deleteUsers);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

setInterval(() => {
  let today = new Date();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  io.emit("time", time);
}, 1000);

// This server-side code sets up an Express server with Socket.IO integration.
// It handles various events emitted by the clients, interacts with the database
// to store and retrieve data, and provides endpoints for retrieving and deleting user data.
