const { Snowflake } = require('@theinternetfolks/snowflake');
var mongoosePaginate = require('mongoose-paginate');
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      _id : {type : Number, default :Snowflake.generate()},
      name: {type : String},
      slug: {type : String ,unique: true ,dropDups: true},
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
    { timestamps: true , _id: false }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Community = mongoose.model("community", schema);
  return Community;
};
