const express = require('express');
const { findAll,create,findOne,update,deleteRecord} = require('../controllers/role.controller');

const roleRouter = express.Router();

roleRouter.get('/', findAll);

roleRouter.post('/', create);

roleRouter.get("/:id", findOne);

roleRouter.put("/:id", update);

roleRouter.delete("/:id", deleteRecord);


exports.roleRouter = roleRouter;