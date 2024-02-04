const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const LocalStrategy = require("../config/passport").LocalStrategy;
const jwt = require("jsonwebtoken");

// User Login Controller
exports.userLogin = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Login failed:", info.message);
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Error:", err);
        return next(err);
      }
      // Inside your login route
      // Assuming 'user' contains the user data
      const userPayload = {
        username: user.username,
        role: user.role,
        userId: user._id,
      };
      const token = jwt.sign(userPayload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      console.log("Login successful:", user.username);
      const sanitizedUser = {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      };
      return res.json({
        message: "Logged in successfully",
        token: token,
      });
    });
  })(req, res, next);
};

// User Register Controller
exports.userRegister = async (req, res) => {
  const { username, email, password, cpassword, otp } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userNameExist = await User.findOne({ username });
  const userEmailExist = await User.findOne({ email });
  if (userNameExist) {
    return res.json({ message: "Username Already Used" });
  }
  if (userEmailExist) {
    return res.json({ message: "UserEmail Already Used" });
  }
  try {
    if (password === cpassword) {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });
      await newUser.save();
      res.json({ message: "User registered successfully" });
    } else {
      res.json({ message: "Enter same passwords" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// User Logout Controller
exports.userLogout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};
exports.userUpdate = async (req, res) => {
  const userId = req.user._id;
  const { firstname, lastname, mobilenumber, gender } = req.body;
  // console.log(req.body);

  try {
    const user = User.findById(userId);
    if (userId) {
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          firstname,
          lastname,
          mobilenumber,
          gender,
        },
        { new: true }
      );
      res.json(updateUser);
    } else {
      res.status(401).json({ message: "User Not Found" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Validate Username before register
exports.validateUsername = async (req, res) => {
  // console.log(req.params);
  const username = req.params.username;

  if (username.length >= 4 && !username.includes(" ")) {
    const userExist = await User.findOne({ username: username });
    if (userExist) {
      res.json({ message: "Username Already Used" });
    } else {
      res.json({ message: "Available" });
    }
  } else {
    res.json({ message: "Invalid" });
  }
};

// Validate Email before register
exports.validateEmail = async (req, res) => {
  // console.log(req.params);
  const email = req.params.email;

  if (email) {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.json({ message: "Email already used" });
    } else {
      res.json({ message: "Available" });
    }
  } else {
    res.json({ message: "Email not provided" });
  }
};
// Fetch All Courses Controller
exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
// Fetch All Courses Controller
exports.changeRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await User.findById(userId);
    console.log(userId, user.username);
    if (user) {
      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          role,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } else {
      res.status(401).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
// Delete Course Controller
exports.userDelete = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      // Delete the course
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: "User Deleted" });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
