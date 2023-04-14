const express = require('express');
// const tutorials = require("../controllers/tutorial.controller.js");
const { roleRouter } = require('./role.router');
const { userRouter } = require('./user.router');
// const { testRouter } = require('../modules/test/test.router');
// const { protectionRouter } = require('../modules/protection/protection.router');
// const { memberRouter } = require('../modules/member/member.router');
// const { officerRouter } = require('../modules/officer/officer.router');
// const { userRouter } = require('../modules/user/user.router');
// const { otherRouter } = require('../modules/other/other.router');

const apiRouter = express.Router();

apiRouter.use('/role', roleRouter);

apiRouter.use('/auth', userRouter);

exports.apiRouter = apiRouter;

// module.exports = app => {


//   // Create a new Tutorial
//   router.post("/", tutorials.create);

//   // Retrieve all Tutorials
//   router.get("/", tutorials.findAll);

//   // Retrieve all published Tutorials
//   router.get("/published", tutorials.findAllPublished);

//   // Retrieve a single Tutorial with id
//   router.get("/:id", tutorials.findOne);

//   // Update a Tutorial with id
//   router.put("/:id", tutorials.update);

//   // Delete a Tutorial with id
//   router.delete("/:id", tutorials.delete);

//   // Create a new Tutorial
//   router.delete("/", tutorials.deleteAll);

//   app.use("/api/tutorials", router);
// };
