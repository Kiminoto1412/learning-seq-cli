module.exports = (err, req, res, next) => {
  //   console.log(err);
//   console.log(err.name); //SequelizeValidationError
//   console.log(err.message);

  //ทำเพื่อแก้เลข error เป็น400
  if(err.name === 'SequelizeValidationError'){
      err.statusCode = 400
  }
  res.status(err.statusCode || 500).json({ message: err.message });
};
