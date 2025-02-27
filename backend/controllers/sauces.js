const sauceModel = require("../models/sauce");
//import fs package (fileSystem)
const fs = require('fs');

//Middleware to create a new sauce
exports.createSauce =(req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  const sauce = new sauceModel({
    ...sauceObject,
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Middleware to get one sauce in particular 
exports.getOneSauce = (req, res, next) => {
  sauceModel.findOne({ 
    _id: req.params.id 
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
       error
      });
    }
  );
};

//middleware to update sauce's informations
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  sauceModel.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Middleware to delete one sauce, use of fs(unlink) to delete the sauce  from the filesystem
exports.deleteSauce = (req, res, next) => {
  sauceModel.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauceModel.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ message: "Une erreur serveur est survenue" , error }));
};

// Middleware to get all sauces in an array we return to the frontend
exports.getAllSauces =  (req, res, next) => {
  sauceModel.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error 
      });
    }
  );
};

//Middleware to allow the user to like or not each sauces
exports.likesFields = (req, res, next) => {
  let likeField = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (likeField === 1) {
    sauceModel.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
    .then(() => res.status(200).json({ message: `J'aime` }))
    .catch((error) => res.status(400).json({ error })) 
  } else if (likeField === -1) {
      sauceModel.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
      .then(() => res.status(200).json({ message: "Je n'aime pas !" }))
      .catch(error => res.status(400).json({ error }))
  } else {
    sauceModel.findOne({ _id: sauceId })
    .then(sauce => {
      if (sauce.usersLiked.includes(userId)) {
        sauceModel.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
        .then(() => { res.status(200).json({ message: "Le j'aime a bien été supprimé !" }) })
        .catch(error => res.status(400).json({ error }))
      } else if (sauce.usersDisliked.includes(userId)) {
        sauceModel.updateOne({ _id: sauceId}, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
        .then(() => { res.status(200).json({ message: "Le je n'aime pas a bien été supprimé !" }) })
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
  }
}