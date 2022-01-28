//express necessaire pour créer un router
const express = require('express');
//fonction router d'express
const router = express.Router();

//controler pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

//utilisation de la route signup
router.post('/signup', userCtrl.signup);
//utilisation de la route login
router.post('/login', userCtrl.login);

//exportation du router
module.exports = router;