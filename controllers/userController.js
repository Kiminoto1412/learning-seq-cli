const createError = require("../utils/createError");
const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    //   const body = req.body
    //destructuring
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      createError("password did't match ", 400);
      // การสร้างerrorแบบสร้างตรงนี้เลย แต่รก
      // return res.status(400).json({message: "password did't match "})
    }

    //Create new User
    await User.create({ username: username, email, password });
    res.status(201).json({ message: "register success" });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    //update แบบ1 ทำเอง
    // const { username, email, password, confirmPassword } = req.body;
    // const user = await User.findOne({ where: { username: username } });
    // if (username) {
    //   if (password !== confirmPassword) {
    //     createError("password did't match ", 400);
    //   } else {
    //     user.email = email;
    //     user.password = password;
    //     await User.update({ username, email, password }, {where:{username: username}});
    //     res.status(200).json({ message: "update user successful" });
    //   }
    // } else {
    //   console.log("User not found");
    //   createError("User not found ", 400);
    // }

    //update แบบ2 ทำเอง
    // const { username, email, password, confirmPassword } = req.body;
    // const user = await User.findOne({ where: { username: username } });
    // if (username) {
    //   if (password !== confirmPassword) {
    //     createError("password did't match ", 400);
    //   } else {
    //     user.email = email;
    //     user.password = password;
    //     // await User.update({ username, email, password }, {where:{username: username}});
    //     // console.log(User);
    //     console.log(user);
    //     await user.save();
    //     res.status(200).json({ message: "update user successful" });
    //   }
    // } else {
    // console.log("User not found");
    // createError("User not found ", 400);
    // }

    //update จากจาร
    const { id } = req.params;
    // console.log(id);
    const { email, oldPassword, newPassword, confirmPassword, birthDate } =
      req.body;
    const user = await User.findOne({ where: { id } });
    // console.log(user)
    if (!user) {
      createError("user is not found", 400);
    }
    if (oldPassword !== user.password) {
      createError("incorrect password", 400);
    }
    if (newPassword !== confirmPassword) {
      createError("password did't match ", 400);
    }

    await User.update(
      { email, password: newPassword, birthDate },
      { where: { id } }
    );
    res.status(200).json({ message: "update user successful" });
  } catch (err) {
    next(err);
  }
};
