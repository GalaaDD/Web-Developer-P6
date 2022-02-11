//mangoose use
const mongoose = require('mongoose');
//prevalidation
const uniqueValidator = require('mongoose-unique-validator');

//Declaration of the userSchema, with the use of mangoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//use of the pluggin mangoose-unique-validator to prevalidate and send errors
userSchema.plugin(uniqueValidator);

//exportation of the schema we transform to be a model we could use throuhout the project
module.exports = mongoose.model('User', userSchema);