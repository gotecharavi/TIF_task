const express = require('express');
const { findAll,signup,signin,userDetail,findOne,update,deleteRecord} = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.get('/', findAll);
//.populate('eventsAttended') 
userRouter.post('/signup', signup);

userRouter.post('/signin', signin);

userRouter.get("/me", userDetail);

userRouter.get("/:id", findOne);

userRouter.put("/:id", update);

userRouter.delete("/:id", deleteRecord);


exports.userRouter = userRouter;