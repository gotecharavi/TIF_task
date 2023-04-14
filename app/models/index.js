require('dotenv').config()

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URL;
db.roles = require("./role.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.community = require("./community.model.js")(mongoose);
db.member = require("./member.model.js")(mongoose);
	
module.exports = db;
