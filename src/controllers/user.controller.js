const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const err = new Error("Username and password are required.");
      err.status = 400;
      return next(err);
    }
    const user = await User.findOne({ username });
    if (!user || !user.authenticate(password)) {
      const err = new Error("Invalid username or password.");
      err.status = 401;
      return next(err);
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      success: true,
      token,
      user: { _id: user._id, username: user.username, admin: user.admin },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, username: user.username, admin: user.admin },
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.viewDetailUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
