const { User } = require("../models");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("you are unauthorized", 401);
    }
    // //destructuring การsplit
    const [, token] = authorization.split(" ");
    if (!token) {
      createError("you are unauthorized", 401);
    }

    const secretKey = process.env.JWT_SECRET_KEY || "1q2w3e";
    const decodedPayload = jwt.verify(token, secretKey);

    const user = await User.findOne({ where: { id: decodedPayload.id ?? 0 } });

    if (!user) {
        createError("user not found", 400);
    }

    if(decodedPayload.iat * 1000 < new Date(user.lastUpdatePassword).getTime()){ //iat = issue_at_time
        createError("you are unauthorized", 401);
    }
    // console.log(decodedPayload.iat)
    // console.log(new Date(user.lastUpdatePassword).getTime())

    req.user =user; //เวลาใช้Middlewareร่วมกัน มันจะใช้ req objectร่วมกัน เราเลยส่งออกไปแบบนี้ได้
    next()
  } catch (err) {
    next(err);
  }
};
