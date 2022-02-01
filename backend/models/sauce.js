//Appel de mangoose
const mongoose = require('mongoose');


// Schema de données, utilisation de la méthode schema mise à diposition par mangoose, l'id est automatiquement généré par mangoose
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked : { type: String },
    usersDisliked: { type: String },
});

// exportation du schema en tant que modèle mangoose, le rendant disponible à l'utilisation par express
module.exports = mongoose.model('Sauce', sauceSchema);