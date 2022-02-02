//création du routeur, méthode routeur d'express
const express = require('express');
// express.router permet de créer des routeurs séparés pour chaque route principales de l'application
const router = express.Router();
// Importation de controllers contenant les méthodes qui seront appliquées aux routes
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Middleware post pour créer et envoyer une nouvelle sauce, ici nous récuperons les informations nécessaire depuis le body en utilisant le spread afin de faire une copie de tout les éléments de req.body
router.post('/', auth, multer, saucesCtrl.createSauce);
//route GET utilisant find() dans le modèle mangoose afin qu'elle renvoie un tableau contenant toutes les sauces dans la base de données 
router.get('/', auth, multer, saucesCtrl.getAllSauces);
//route GET utilisant : afin de mettre l'ID en paramètre, utilisation de findOne() dans le modèle pour trouver la Sauce unique ayant le meme _id que le paramètre de la requete, il est envoyé au au frontend dans une promise
router.get('/:id', auth, saucesCtrl.getOneSauce); 
//route PUT, utilisation de la méthode .updateOne pour mettre à jour l'objet, suivi de l'objet a modifier ainsi que l'objet modifié, qui correspond à l'id généré par mangoose
router.put('/:id', auth, saucesCtrl.modifySauce);
// middleware delete pour supprimer un objet avec l'utilisation deleteOne, un seul argument car c'est une suppression
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// middleware pour recuperer les likes ou dislike d'un id
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce);

module.exports = router;