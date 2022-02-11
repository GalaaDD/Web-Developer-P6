//use of express
const express = require('express');
const router = express.Router();

//Calling middlewares to use it on the routes
const userCtrl = require('../controllers/User');
const passwordCheck = require('../middleware/password');
const emailCheck = require('../middleware/email');

//Routes and middlewares it has
router.post('/signup', emailCheck, passwordCheck, userCtrl.signup);
router.post('/login', userCtrl.login);

//Router's exportation
module.exports = router;