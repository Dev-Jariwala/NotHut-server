require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with the URL of your client application
    credentials: true, // Enable credentials (cookies) support
  })
);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "None",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connection sucessful"))
  .catch((err) => console.log(err));

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("listining from other side");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("front end port", process.env.FRONTEND_URL);
  console.log(`Server is running on port ${PORT}`);
});
