//Use of validator
const emailSchema = require('validator');

//Exportation of the email middleware
module.exports = (req, res, next) => {

  if (!emailSchema.isEmail(req.body.email)) {

    return res.status(400).json({ error: 'Veuillez entrer un email valide !'});
    
  } else {
    next();
  }
};