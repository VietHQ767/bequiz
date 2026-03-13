const Quiz = require("../models/Quiz");

exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.viewDetailQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.getQuestionsByKeyword = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.addQuestionToQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $addToSet: { questions: req.body.questionId } },
      { new: true }
    ).populate("questions");
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

exports.addManyQuestionsToQuiz = async (req, res, next) => {
  try {
    const questionIds = req.body.questionIds || [];
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $addToSet: { questions: { $each: questionIds } } },
      { new: true }
    ).populate("questions");
    if (!quiz) {
      const err = new Error("Quiz not found");
      err.status = 404;
      return next(err);
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};
