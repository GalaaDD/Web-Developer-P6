const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
  if(!passwordSchema.validate(req.body.password)){

    return res.status(400).json({error: 
      'Un minimum de 8 caractères avec des majuscules, minuscules, deux chiffres et un symbole sont requis afin de créer un mot de passe sécurisé !' 
    });
    
  }else{
    next();
  }
};