const socket = io();

const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const messages = document.querySelector("#messages");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const userContainer = document.querySelector("#userContainer");
const clock = document.querySelector("#clock");
const diceButton = document.querySelector("#rollButton");
const rollHistory = document.querySelector("#rollHistory");

let myUser;
let myTotal = 0;

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  userContainer.innerHTML = "<h2>Welcome " + myUser + "!</h2>";
  document.getElementById("user").style.display = "none";
  document.getElementById("message").style.display = "block";
  socket.emit("user", {myUser})
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage", { user: myUser, message: input.value });
    input.value = "";
  }
});

diceButton.addEventListener("click", () => {
  const dice = Math.floor(Math.random() * 6) + 1;
  myTotal = myTotal + dice;
  console.log("total" + myTotal);
  socket.emit("rollDice", { user: myUser, dice: dice, total: myTotal });
});

// Actualizar el total y mostrar los resultados del dado
socket.on("diceRolled", (msg) => {
  let item = document.createElement("li");
  // item.textContent = msg;
  item.textContent = msg.user + ": " + msg.dice + " Total: " + msg.total;
  rollHistory.appendChild(item);
});

socket.on("newChatMessage", function (msg) {
  console.log("Chat" + msg.user + " " + msg.message);
  let item = document.createElement("li");
  // item.textContent = msg;
  item.textContent = msg.user + ": " + msg.message;
  messages.appendChild(item);
});

socket.on("time", (timeMsg) => {
  clock.innerHTML = timeMsg;
});
