const { Snowflake } = require('@theinternetfolks/snowflake');
var mongoosePaginate = require('mongoose-paginate');
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      _id : {type : Number, default :Snowflake.generate()},
      name: {type : String ,unique: true ,dropDups: true},
    },
    { timestamps: true , _id: false }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Role = mongoose.model("role", schema);
  return Role;
};
