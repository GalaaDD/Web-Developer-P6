//Constantes pour appeler et pouvoir utiliser express
const express = require('express');
const app = express();
//Constante pour appeler et pouvoir utiliser Mangoose
const mongoose = require('mongoose');

//importation du fichier sauces.js permettant d'appeler le router
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

/*mongoose.connect('mongodb+srv://@cluster0.vy4cg.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 
*/

app.use(express.json());

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