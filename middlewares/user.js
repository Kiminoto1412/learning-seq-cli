const {User} = require('../models')
const createError = require('../utils/createError')

exports.getUserById = async (req ,res ,next ) => {
    try{
        const { userId } = req.body;
    const user = await User.findOne({where:{id: userId ?? 0}})
    if(!user){
      createError('user not found',400)
    }
    next(); //ส่งต่อไปให้todoRoute ทำงานที่Middlewareตัวถัดไป
    }catch(err){
        next(err)
    }
}