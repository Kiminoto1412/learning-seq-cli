const { Todo, User } = require("../models");
const createError = require("../utils/createError");

exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate, userId } = req.body;
    const user = await User.findOne({ where: { id: userId } ?? 0 }); //ใส่0 เพราะcreate id ไม่มีทางเป็น0 มันเริ่มจาก1 ถ้าuserId เป็น undefined หรือ null มันจะได้ค่า userIdเป็น 0 และ เข้าเงื่อนไขif
    if (!user) {
      createError("User not found", 400);
    }
    //title ไม่ต้องvalidate เพราะมีการvalidate ที่ modelsแล้ว

    const todo = await Todo.create({ title, completed, dueDate, userId });
    res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate, userId } = req.body;
    const user = await User.findOne({ where: { id: userId } ?? 0 });
    const todo = await Todo.findOne({
      where: { userId: user.id, id: id } ?? 0,
    });
    // console.log(user)
    // console.log(todo)
    if (!user) {
      createError("user is not found", 400);
    }
    if (!todo) {
      //ถ้าtodo เป็น null แตก และเข้าเงื่อนไขนี้
      createError("Todo id is not found", 400);
    }
    await Todo.update({ title, completed, dueDate }, { where: { id } });
    res.status(200).json({ message: "update todo successful" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await User.findOne({ where: { id: userId } ?? 0 });
    const todo = await Todo.findOne({
      where: { userId: user.id, id: id } ?? 0,
    });
    if (!user) {
      createError("user is not found", 400);
    }
    if (!todo) {
      createError("Todo id is not found", 400);
    }
    await Todo.destroy({ where: { id } });
    res.status(204).json({ message: "delete todo successful" });
  } catch (err) {
    next(err);
  }
};


exports.getAllTodo = async (req, res, next) => {
  try {
    console.log(Todo);
    const todos = await Todo.findAll({
      attributes: ["id", "title", "completed", "dueDate", "userId"],
    });
    res.status(201).json({ todos: todos });
  } catch (err) {
    next(err);
  }
};

exports.getIdTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const IdTodo = await Todo.findOne({
      where: { id: id } ?? 0,
      attributes: ["id", "title", "completed", "dueDate", "userId"],
    });
    console.log(IdTodo);
    res.status(200).json({ IdTodo: IdTodo });
  } catch (err) {
    next(err);
  }
};
