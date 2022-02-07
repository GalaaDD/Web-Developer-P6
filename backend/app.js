//Constantes pour appeler et pouvoir utiliser express
const express = require('express');
const app = express();
//Constante pour appeler et pouvoir utiliser Mangoose
const mongoose = require('mongoose');
require('dotenv').config();
//nous donne accès au chemins dans notre système de fichiers
const path = require('path');
//correctif de certaines failles de securitées de node.js
const helmet = require('helmet');

//importation du fichier sauces.js permettant d'appeler le router
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');


mongoose.connect(process.env.SECRET_MDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

app.use(express.json());

//app.use(helmet()); PROBLEME CROSSORIGIN 

//Middleware qui va répondre au requete via /images/ et servir le dossier images de façon statique, utilisation de la méthgode express.static
app.use('/images', express.static(path.join(__dirname, 'images')));

//Middleware pour modifier les authorisations provenant de deux ports différents,(CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// utilisation du router importé de sauces.js
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;