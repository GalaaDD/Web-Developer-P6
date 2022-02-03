//Dossier contenant la logique métier
const sauceModel = require("../models/sauce");
//importation du package 'fs de node (fileSystem), pour avoir accès aux différentes opérations lié au système de fichiers
const fs = require('fs');

// modification de la logique de la création d'objet dans la base de donnée car le format de la requete a été changé pour pouvoir envoyer un fichier avec la requete(multer), 
exports.createSauce =(req, res, next) => {
  //objet js sous forme de chaine de caractères, il faudra analyser la chaine et la transformer en objet js, extraire l'objet json par req.body.sauce, donc depuis sauce
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

//modification de la route put, (multer), test pour savoir dans quelle situation on se trouve, si il y'a une nouvelle image il y'aura un req.file(on saura comment traiter), sinon sans nouvelle image, il n'y aura pas de req.file(on saura aussi comment la traiter simplement comme objet directement)
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
//modification de la route delete, avant de supprimer l'objet de la base de donnée, on va donc chercher avec le findOne, on veut le nom du fichier précisément, utilisation de la méthode unlick du package node fs pour supprimer un fichier
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

// Likes/ Dislikes
// route like dislike, utilisation de l'information envoyé par le frontend(0,1,-1) dans le req.body, utilisation du req.body pour renvoyer l'information
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  //utilisation de l'instruction switch qui permet d'évaluer le résultat de like et va donc évaluer ce qui sera renvoyé par le frontend afin d'executer le code du dit "case" correspondant au resultat, le break permet de bien délimiter chaque case en evitant l'execution de tout les cas suivant, il permet donc de sortir de l'instruction switch
  switch (like) {
    case 1 :
        sauceModel.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))  
      break;

    case 0 :
      sauceModel.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              sauceModel.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              sauceModel.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
      sauceModel.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
  }
}