const { Snowflake } = require('@theinternetfolks/snowflake');
var mongoosePaginate = require('mongoose-paginate');
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      _id : {type : Number, default :Snowflake.generate()},
      name: {type : String ,required: true, default: null},
      email: {type : String,unique :true,dropDups: true,required: true},
      password: {type : String,required: true},

    },
    { timestamps: true , _id: false }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object["password"];
    return object;
  });
  schema.plugin(mongoosePaginate);
  const User = mongoose.model("user", schema);
  return User;
};
