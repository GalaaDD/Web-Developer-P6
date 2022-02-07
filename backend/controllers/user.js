const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//middleware pour l'enregistrement de nouveaux utilisateurs, ou l'on va hasher le mot de passe et enregistrer le user dans la base de donnée
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
      .catch(error => res.status(500).json({  message: "erreur" , error }));
};

//middleware pour connecter les utlisateurs existants, on va trouver le user dans la base de donnée auquel correspond l'addresse e-mail et comparer le mot de passe avec le hash
exports.login = (req, res, next) => {
  userModel.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe  ou login incorrect !' });
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
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};