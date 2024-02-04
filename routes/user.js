const express = require("express");
const router = express.Router();
const { isAuthenticated, authUser } = require("../controllers/authControllers");
const {
  userLogin,
  userRegister,
  userLogout,
  validateUsername,
  validateEmail,
  verifyNewUserEmail,
} = require("../controllers/userController");

// User Login Route
router.post("/login", userLogin);

// User Register Route
router.post("/register", userRegister);

// User Logout Route
router.get("/logout", isAuthenticated, userLogout);

// User Authenticate Route
router.get("/authenticate", authUser);

// User name available status route
router.get("/validateUsername/:username", validateUsername);

// User email available status route
router.get("/validateEmail/:email", validateEmail);

module.exports = router;
