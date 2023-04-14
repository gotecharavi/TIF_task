const { Snowflake } = require('@theinternetfolks/snowflake');
let Validator = require('validatorjs');
const db = require("../models");
const Role = db.roles;

// Create and Save a new Role
exports.create = (req, res) => {
  // Validate request
  let rules = {
    name: 'required|min:2',
  };
  let validation = new Validator(req.body, rules);

  if(validation.fails()){
     res.send({status: false, "errors": [{
        "param": "name",
        "message": "Name should be at least 2 characters.",
        "code": "INVALID_INPUT"}
      ]});
     return;
  }

  // Create a Role
  const role = new Role({
    _id : Snowflake.generate(),
    name: req.body.name,
  });

  // Save Role in the database
  role
    .save(role)
    .then(data => {
      res.send({
        status : true,
        content: {data : data }});
    })
    .catch(err => {
      res.send({
        status : false,
        message:
          err.message
      });
    });
};

// Retrieve all Role from the database.
exports.findAll = (req, res) => {
  var perPage = 10, page = req.query.page? Math.max(0, req.query.page - 1) : 0;

  Role.paginate({}, { offset: perPage * page, limit: perPage }).then(function(result) {
    if(result.docs.length !=0){
       res.send({status: true,
        content: { 
          meta: { total: result.total, pages: Math.max(result.total/perPage),page: page},
          data:result.docs
      }});
    }else{
       res.send({status: false, message: 'Roles not found'})

    }

  });
};

// Find a single Role with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Role.findById(id)
    .then(data => {
      if (!data)
        res.send({status: false, message: "Not found Role with id " + id });
      else res.send({status: true, content: { data: data}});
    })
    .catch(err => {
      res
        .send({status: false, message: "Error retrieving Role with id=" + id });
    });
};

// Update a Role by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Role.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.send({status: false,
          message: `Cannot update Role with id=${id}. Maybe Role was not found!`
        });
      } else res.send({status: true, message: "Role was updated successfully." });
    })
    .catch(err => {
      res.send({status: false,
        message: "Error updating Role with id=" + id
      });
    });
};

// Delete a Role with the specified id in the request
exports.deleteRecord = (req, res) => {
  const id = req.params.id;

  Role.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.send({status: false,
          message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
        });
      } else {
        res.send({status: true,
          message: "Role was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.send({status: false,
        message: "Could not delete Role with id=" + id
      });
    });
};