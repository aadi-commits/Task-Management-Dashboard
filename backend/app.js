const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

module.exports = app;
