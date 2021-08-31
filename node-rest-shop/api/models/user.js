const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   _id:mongoose.Schema.Types.ObjectId,
   name:String,
   email:{type:String,require:true,unique:true, match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
   password:{type:String,require:true}
});

module.exports = mongoose.model('User',UserSchema);