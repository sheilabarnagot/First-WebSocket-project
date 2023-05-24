const { connect } = require("mongoose");

const dbConnection = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/chatIo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
    console.log("DB connected succesfully");
  } catch (error) {
    throw new Error("Error connection with DB");
  }
};

module.exports = { dbConnection };
