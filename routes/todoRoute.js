const express = require("express");

const todoController = require("../controllers/todoController");
// const userMiddleware = require("../middlewares/user");


const router = express.Router();

router.post("/", todoController.createTodo);

router.put("/:id", todoController.updateTodo);

router.delete("/:id", todoController.deleteTodo);

router.get("/getAll", todoController.getAllTodo);

router.get("/:id", todoController.getIdTodo);

module.exports = router;
