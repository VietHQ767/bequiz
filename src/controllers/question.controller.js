const Question = require("../models/Question");

exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find().populate("Author", "username");
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const data = { ...req.body, Author: req.user._id };
    const question = await Question.create(data);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

exports.viewDetailQuestions = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate("Author", "username");
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
};
