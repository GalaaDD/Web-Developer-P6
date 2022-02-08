const sauceModel = require("../models/sauce");
//import fs package (fileSystem)
const fs = require('fs');

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
    .catch(error => res.status(500).json({ error }));
};

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

exports.likesFields = (req, res, next) => {
  const likeField = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id

  if (likeField === 1) {
    sauceModel.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
    .then(() => res.status(200).json({ message: `J'aime` }))
    .catch((error) => res.status(400).json({ error })) 
  } else if (likeField === -1) {
      sauceModel.updateOne({ _id: sauceId }, { $inc: { dislikes: (likeField++) * -1 }, $push: { usersDisliked: userId } })
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