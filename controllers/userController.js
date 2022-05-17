const createError = require("../utils/createError");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    //   const body = req.body
    //destructuring
    const { username, email, password, confirmPassword } = req.body;
    if (!password) {
      //check passwordที่เป็น empty string เพราะพอมันhashedมันจะไม่เป็นempty
      createError("password is require", 400);
    }
    if (password.length < 6) {
      createError("password must be at least 6 character ", 400);
    }
    if (password !== confirmPassword) {
      createError("password did't match ", 400);
    }
    //   // การสร้างerrorแบบสร้างตรงนี้เลย แต่รก
    //   // return res.status(400).json({message: "password did't match "})
    // console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    //$2a$10$VKnh9UyWpB4OvyGeVc.v4.czGovCrD0ipA6kUV4I6TC2FnuqZqhi2

    //Create new User
    await User.create({ username: username, email, password: hashedPassword });
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
    // const { id } = req.params;
    // console.log(id);
    const { email, oldPassword, newPassword, confirmPassword, birthDate } =
      req.body;
    // const user = await User.findOne({ where: { id : req.user.id } });
    // // console.log(user)
    // if (!user) {
    //   createError("user is not found", 400);
    // }

    // console.log(req)
    // console.log(req.user)
    // console.log(req.user.password)
    // if (oldPassword !== req.user.password) {
    //   createError("incorrect password", 400);
    // }
    const checkHashedPassword = await bcrypt.compare(oldPassword, req.user.password);
    // console.log(checkHashedPassword);
    if (!checkHashedPassword) {
      createError("invalid password", 400);
    }

    if (newPassword !== confirmPassword) {
      createError("password did't match ", 400);
    }


    await User.update(
      { email, password: newPassword, birthDate },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ message: "update user successful" });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      createError("username is required", 400);
    }
    if (!password) {
      createError("password is required", 400);
    }
    const user = await User.findOne({ where: { username } });
    // console.log(user.password)
    if (!user) {
      //หาuser เจอป่าว
      createError("Invalid username or password", 400);
    }

    const checkHashed = user.password;
    const checkHashedPassword = await bcrypt.compare(password, checkHashed);
    console.log(checkHashedPassword);
    if (!checkHashedPassword) {
      createError("password did't match ", 400);
    }

    const payload = {
      id: user.id,
      username: username, //เอามาจากbody ไม่ต้อง user.username
      email: user.email
    };
    const secretKey = process.env.JWT_SECRET_KEY || "1q2w3e";
    const token = jwt.sign(payload, secretKey, {
      algorithm: "HS512",
      expiresIn: '30d',
      // expiresIn: 1,
    });
    console.log(token)

    res.status(200).json({ message:'login success' , token });
  } catch (err) {
    next(err);
  }
};
