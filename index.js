const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { checkUser } = require("./middlewares/authMiddleware");

const app = express();

dotEnv.config();

// Some Middlewares
app.use(express.json());
app.use(cookieParser());

// Mongoose Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

// API Routes
app.use("*", checkUser); // get current user middleware

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

// Server Running on
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Backed Server Started on PORT: ${port}`);
});
