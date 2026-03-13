const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const tokenBlacklist = new Set();

const verifyUser = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.headers["x-access-token"] ||
      req.body?.token;

    if (!token) {
      const err = new Error("Authentication required");
      err.status = 401;
      return next(err);
    }

    if (tokenBlacklist.has(token)) {
      const err = new Error("Token has been logged out");
      err.status = 401;
      return next(err);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      const err = new Error("Invalid token");
      err.status = 401;
      return next(err);
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      const err = new Error("Invalid user");
      err.status = 401;
      return next(err);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.admin) {
    return next();
  }
  const err = new Error("You are not authorized to perform this operation!");
  err.status = 403;
  return next(err);
};

const verifyAuthor = async (req, res, next) => {
  try {
    const questionId = req.params.questionId || req.params.id;
    if (!questionId) {
      const err = new Error("Question ID is required");
      err.status = 400;
      return next(err);
    }

    const question = await Question.findById(questionId).select("Author");
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    const authorId = question.Author?.toString?.();
    const userId = req.user?._id?.toString?.();
    if (authorId && userId && authorId === userId) {
      return next();
    }

    const err = new Error("You are not the author of this question");
    err.status = 403;
    return next(err);
  } catch (err) {
    next(err);
  }
};

const invalidateToken = (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.headers["x-access-token"] ||
    req.body?.token;
  if (token) {
    tokenBlacklist.add(token);
  }
  next();
};

module.exports = {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
  invalidateToken,
};
