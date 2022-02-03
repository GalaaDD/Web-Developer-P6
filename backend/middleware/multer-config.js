//importation de multer 
const multer = require('multer');

//dictionnaire mime types qui sera un objet, nous permettant de créer l'extensiuon du fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// objet de configuration pour multer, utilisation de diskStorage pour dire qu'on va l'enregistrer sur le disque, son objet de configuration a besoin de deux éléments: la destination (indiquant à multer dans quel dossier enregistrer les fichiers,prenant lui meme trois arguments(la requete, le file, le callback)=> appel du callback(null(afin d'indiquer qu'il n'y a pas eu d'erreur) le nom du dossier en deuxième argument)), filename, (requete, fichier, callback(=> création du nouveau nom pour le fichier))
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
// exportation du middleware multer completement configuré, appel de la méthode multer à laquelle on passe l'objet storage, appel à la méthode single afin d'indiquer qu'il s'agit d'un fichier unique, fichier images uniquement
module.exports = multer({storage: storage}).single('image');