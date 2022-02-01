//Constantes pour appeler et pouvoir utiliser express
const express = require('express');
const app = express();
//Constante pour appeler et pouvoir utiliser Mangoose
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');


//importation du fichier sauces.js permettant d'appeler le router
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

app.use(express.json());

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