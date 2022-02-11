//use of mangoose
const mongoose = require('mongoose');

//use of mangoose to create a schema for the sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true},
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true},
});

//exportation of the schema we transform to be a model we could use throughout the project
module.exports = mongoose.model('Sauce', sauceSchema);