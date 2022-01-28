//Appel de mangoose
const mongoose = require('mongoose');
//package de validation pour prévalider les informations avant de les enregistrer
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma avec la méthode schema de mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Application au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// exportation du model mangoose qui s'appelera 'user' et aura userSchema en schema de données
module.exports = mongoose.model('User', userSchema);