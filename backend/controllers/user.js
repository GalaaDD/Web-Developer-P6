const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//middleware to signUp, create a new user, hash the password and save it into the data base 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new userModel({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({  message: 'Utilisateur existant !', error }));
      })
      .catch(error => res.status(500).json({  message: "Une erreur serveur est survenue" , error }));
};

//Middleware to login to the user account, comparing hashes(passwords), and to create a token system with JsonWebToken
exports.login = (req, res, next) => {
  userModel.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur inexhistant  !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe ou login incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ message: "Une erreur serveur est survenue", error }));
      })
      .catch(error => res.status(500).json({ message: "Une erreur serveur est survenue", error }));
};