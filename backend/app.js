//Imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const Ddos = require('ddos');
const ddos = new Ddos;

//Routers call
const userRoutes = require('./routes/User');
const saucesRoutes = require('./routes/sauces');

//Connection to mangoDB
mongoose.connect(process.env.SECRET_MDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

app.use(express.json());
app.use(ddos.express);

//making images' folder static
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

//CORS authorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// use of the routers called earlier
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;