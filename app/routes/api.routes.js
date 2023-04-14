const express = require('express');
const { roleRouter } = require('./role.router');
const { userRouter } = require('./user.router');

const apiRouter = express.Router();

apiRouter.use('/role', roleRouter);

apiRouter.use('/auth', userRouter);

exports.apiRouter = apiRouter;
