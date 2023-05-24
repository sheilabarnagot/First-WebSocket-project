const mongoose = require("mongoose");

const chatioSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    message: [
      {
        type: String,
      },
    ],
    games: [
      {
        type: Number,
        default: 0,
      },
    ],
    total: {
      type: Number,
      // required: true,
      default: 0,
    },
  },
  { versionKey: false }
);

const Chatio = mongoose.model("Chatio", chatioSchema);
module.exports = { Chatio };

// We use [] in message and games to be able to save the messages as an object
