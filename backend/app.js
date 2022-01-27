//Constantes pour appeler et pouvoir utiliser express
const express = require('express');
const app = express();
app.use(express.json());

//Constante pour appeler et pouvoir utiliser Mangoose
const mongoose = require('mongoose');
//constante pour appeler et pouvoir utiliser le modèle "thing"
const Thing = require('./models/thing');

mongoose.connect('mongodb+srv://GD:798826Ang@cluster0.vy4cg.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

//Middleware pour modifier les authorisations provenant de deux ports différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//Middleware post pour créer et envoyer une nouvelle sauce, ici nous récuperons les informations nécessaire depuis le body en utilisant le spread afin de faire une copie de tout les éléments de req.body
app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

//route GET utilisant find() dans le modèle mangoose afin qu'elle renvoie un tableau contenant tous les Things dans la base de données 
app.use('/api/sauces', (req, res, next) => {
Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

//route GET utilisant : afin de mettre l'ID en paramètre, utilisation de findOne() dans le modèle pour trouver le Thing unique ayant le meme _id que le paramètre de la requete, il est envoyé au au frontend dans une promise
app.get('/api/sauces/:id', (req, res, next) => {
Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

// Middleware servant à récuprer les informations de chaque sauce
app.get('/api/sauces', (req, res, next) => {
  const sauces = [
    {
        _id: 'oeihfzeoi',
        name : "nom de la sauce",
        manufacturer : "fabricant de la sauce",
        description :  "description de la sauce",
        mainPepper : "le principal ingrédient épicé de la sauce",
        imageUrl :"l'URL de l'image de la sauce téléchargée par l'utilisateur",
        heat : "nombre entre 1 et 10 décrivant la sauce",
        likes :"nombre d'utilisateurs qui aiment (= likent) la sauce",
        dislikes : "nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce",
        usersLiked :"tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce",
        usersDisliked : "tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce",

    },
    {
        _id: 'oeihfzeomoihi',
        name : "nom de la sauce",
        manufacturer : "fabricant de la sauce",
        description :  "description de la sauce",
        mainPepper : "le principal ingrédient épicé de la sauce",
        imageUrl :"l'URL de l'image de la sauce téléchargée par l'utilisateur",
        heat : "nombre entre 1 et 10 décrivant la sauce",
        likes :"nombre d'utilisateurs qui aiment (= likent) la sauce",
        dislikes : "nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce",
        usersLiked :"tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce",
        usersDisliked : "tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce",
    },
  ];
  res.status(200).json(sauces);
});



module.exports = app;