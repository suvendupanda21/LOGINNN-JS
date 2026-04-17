require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api", require("./signup"));
app.use("/api", require("./login"));
app.use("/api", require("./otp.js"));
app.use("/api", require("./emailverification.js"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});