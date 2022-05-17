const express = require("express");
const userController = require('../controllers/userController');
const { authenticate } = require("../middlewares/authenticate");
const router = express.Router();

// POST/users/register
router.post("/register", userController.register);
// PUT/users
router.put("/", authenticate,userController.updateUser);
//POST/users/login
router.post("/login", userController.loginUser);


module.exports = router;
