const { Snowflake } = require('@theinternetfolks/snowflake');
let Validator = require('validatorjs');
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var secret ='secret-task';
const db = require("../models");
const User = db.user;

// Signup new User
exports.signup = async (req, res) => {
  // Validate request
  let rules = {
    name: 'required|min:2',
    email: 'required|email',
    password: 'required|min:6',
  };
  let validation = new Validator(req.body, rules);

  if(validation.fails()){
     res.status(400).send({status: false, "errors": validation.errors.errors});
     return;
  }

  // check email 
  const checkEmail =  await User.findOne({email: req.body.email});

  if(checkEmail){
    res.status(400).send({status: false, "errors": { "email": ["User with this email address already exists."]}});
    return   
  }
  // Create a User
  const user = new User({
    _id : Snowflake.generate(),
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });


  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send({
        status : true,
        content: {data : data }});
    })
    .catch(err => {
      res.status(400).send({
        status : false,
        message:
          err.message
      });
    });
};

// signIn User with an id
exports.signin = async (req, res) => {

  let rules = {
    email: 'required|email',
    password: 'required|min:6',
  };
  let validation = new Validator(req.body, rules);

  if(validation.fails()){
     res.status(400).send({status: false, "errors": validation.errors.errors});
     return;
  }

  // check email 
  const user =  await User.findOne({email: req.body.email});

  if(!user){
    res.status(400).send({status: false, "errors": [
    {
      "param": "email",
      "message": "Please provide a valid email address.",
      "code": "INVALID_INPUT"
    }
  ]});
    return   
  }
  var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
  if(!passwordIsValid){
    res.status(400).send({status: false, "errors":  {
      "param": "password",
      "message": "The credentials you provided are invalid.",
      "code": "INVALID_CREDENTIALS"
    }});

  }
  var token = jwt.sign({ id: user.id }, secret, {expiresIn: 86400}); // 24 hours

  res.send({status: true,
    content: { 
      data:user,
      meta: { access_token : token},
  }});

};

// signIn User with an id
exports.userDetail = async (req, res) => {

  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({"status": false,"errors": [{"message": "You need to sign in to proceed.","code": "NOT_SIGNEDIN"}]});
  }

  jwt.verify(token.split(" ")[1], secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({"status": false,"errors": [{"message": "You need to sign in to proceed.","code": "NOT_SIGNEDIN"}]});
    }

    User.findById(decoded.id)
    .then(data => {
      if (!data)
        res.send({status: false, message: "Not found User with id " + id });
        else res.send({status: true, content: { data: data}});
    })
    .catch(err => {
      res
        .send({status: false, message: "Error retrieving User with id=" + id });
    });
  });

};


// Retrieve all User from the database.
exports.findAll = (req, res) => {
  var perPage = 10, page = req.query.page? Math.max(0, req.query.page - 1) : 0;

  User.paginate({}, { offset: perPage * page, limit: perPage }).then(function(result) {
    if(result.docs.length !=0){
       res.send({status: true,
        content: { 
          meta: { total: result.total, pages: Math.max(result.total/perPage),page: page},
          data:result.docs
      }});
    }else{
       res.send({status: false, message: 'Users not found'})

    }

  });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.send({status: false, message: "Not found User with id " + id });
      else res.send({status: true, content: { data: data}});
    })
    .catch(err => {
      res
        .send({status: false, message: "Error retrieving User with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.send({status: false,
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({status: true, message: "User was updated successfully." });
    })
    .catch(err => {
      res.send({status: false,
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.deleteRecord = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.send({status: false,
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({status: true,
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.send({status: false,
        message: "Could not delete User with id=" + id
      });
    });
};