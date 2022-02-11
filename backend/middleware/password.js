const passwordSchema = require('../models/password');

// exportation of password middleware, password verification
module.exports = (req, res, next) => {
  if(!passwordSchema.validate(req.body.password)){

    return res.status(400).json({error: 
      'Un minimum de 8 caractères contenant des majuscules, des minuscules, deux chiffres et un symbole sont requis pour créer un mot de passe !', error 
    });
    
  }else{
    next();
  }
};