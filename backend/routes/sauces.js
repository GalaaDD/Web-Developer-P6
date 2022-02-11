//calling middlewares to use it on the routes, allowing us to see the routes and the middlewares it has on it.
const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routes
router.post('/', auth, multer, saucesCtrl.createSauce); 
router.get('/', auth, multer, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce); 
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likesFields);

//exportation of the router
module.exports = router;