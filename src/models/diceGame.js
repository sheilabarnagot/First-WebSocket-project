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
      default: 0,
    },
  },
  { versionKey: false }
);

const Chatio = mongoose.model("Chatio", chatioSchema);
module.exports = { Chatio };

// Mongoose schema and model for a document in the MongoDB database.
