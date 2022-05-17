const jwt = require("jsonwebtoken");
const { Todo, User } = require("../models");
const createError = require("../utils/createError");

exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate, userId } = req.body;
    // const user = await User.findOne({ where: { id: userId } ?? 0 }); //ใส่0 เพราะcreate id ไม่มีทางเป็น0 มันเริ่มจาก1 ถ้าuserId เป็น undefined หรือ null มันจะได้ค่า userIdเป็น 0 และ เข้าเงื่อนไขif
    // if (!user) {
    //   createError("User not found", 400);
    // }
    //title ไม่ต้องvalidate เพราะมีการvalidate ที่ modelsแล้ว

    const todo = await Todo.create({ title, completed, dueDate, userId });
    res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
};

// exports.updateTodo = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, completed, dueDate, userId } = req.body;
//     // const user = await User.findOne({ where: { id: userId } ?? 0 });
//     // console.log(user)
//     // console.log(todo)
//     // if (!user) {
//     //   createError("user is not found", 400);
//     // }
//     const todo = await Todo.findOne({
//       where: { userId: userId, id: id } ?? 0,
//     });
//     if (!todo) {
//       //ถ้าtodo เป็น null แตก และเข้าเงื่อนไขนี้
//       createError("Todo id is not found", 400);
//     }
//     await Todo.update({ title, completed, dueDate }, { where: { id } });
//     res.status(200).json({ message: "update todo successful" });
//   } catch (err) {
//     next(err);
//   }
// };

//แบบจาร
exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate} = req.body;
    const newValue = {};
    const result = await Todo.update(
      { title, completed, dueDate },
      { where: { id, userId : req.user.id } }
    );
    if (result[0] === 0) {
      //จนแถวที่เกิดการอัพเดทมีกี่แถว ถ้าเป็น0ก็คือไม่เจอ
      createError("todo with this id is not found", 400);
    }
    res.status(200).json({ message: "update todo successful" });
  } catch (err) {
    next(err);
  }
};

// exports.deleteTodo = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;
//     // const user = await User.findOne({ where: { id: userId } ?? 0 });
//     const todo = await Todo.findOne({
//       where: { userId: userId, id: id } ?? 0,
//     });
//     // if (!user) {
//     //   createError("user is not found", 400);
//     // }
//     if (!todo) {
//       createError("Todo id is not found", 400);
//     }
//     await Todo.destroy({ where: { id , userId} });
//     res.status(204).json({ message: "delete todo successful" });
//   } catch (err) {
//     next(err);
//   }
// };

//แบบจาร
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { userId } = req.body;
    const result = await Todo.destroy({ where: { id, userId: req.user.id } });
    if (result === 0) {
      createError("todo with this id is not found", 400);
    }
    // res.status(200).json({ message: "delete todo successful" });
    res.status(204).json({}); //204 เป็น deleteซึ่งจะไม่โชว message
  } catch (err) {
    next(err);
  }
};

exports.getAllTodo = async (req, res, next) => {
  try {
    // const { userId } = req.body;
    // const user = await User.findOne({where:{id: userId ?? 0}})
    // if(!user){
    //   createError('user not found',400)
    // }
    // console.log(Todo);
    // const todos = await Todo.findAll(
    //   { where: { userId } },
    //   {
    //     attributes: ["id", "title", "completed", "dueDate", "userId"],
    //   }
    // );
    // res.status(201).json({ todos: todos });

    // const headers = req.headers;
    // const authorization = headers.authorization
    // console.log(headers)


    // const { authorization } = req.headers;

    // if (!authorization || !authorization.startsWith("Bearer")) {
    //   createError("you are unauthorized", 401);
    // }

    // // //destructuring การsplit
    // const [, token] = authorization.split(" ");
    // if (!token) {
    //   createError("you are unauthorized", 401);
    // }

    // const secretKey = "1q2w3e";
    // const decodedPayload = jwt.verify(token, secretKey);

    // const user = await User.findOne({ where: { id: decodedPayload.id ?? 0 } });
    // if (!user) {
    //   createError("user not found", 400);
    // }
    // console.log(user.id);

    const todos = await Todo.findAll({ where: { userId: req.user.id ?? 0 } });
    res.json({ todos: todos });
  } catch (err) {
    next(err);
  }
};

exports.getIdTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // const user = await User.findOne({where:{id: userId ?? 0}})
    // if(!user){
    //   createError('user not found',400)
    // }

    const todo = await Todo.findOne({
      where: { id: id ?? 0, userId: req.user.id ?? 0 }, //ถ้าไม่มีid ให้ได้0 แล้วidไม่มี0 มันเริ่มที่1 มันก็จะเข้าerror
      attributes: ["id", "title", "completed", "dueDate", "userId"],
    });
    // console.log(todo);
    res.status(200).json({ todo: todo });
  } catch (err) {
    next(err);
  }
};
