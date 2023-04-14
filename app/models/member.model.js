const { Snowflake } = require('@theinternetfolks/snowflake');
var mongoosePaginate = require('mongoose-paginate');
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      _id : {type : Number, default :Snowflake.generate()},
      community: { type: mongoose.Schema.Types.ObjectId, ref: 'community' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      role: { type: mongoose.Schema.Types.ObjectId, ref: 'role' },
    },
    { timestamps: true , _id: false }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Member = mongoose.model("member", schema);
  return Member;
};
