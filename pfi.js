//Configuration du serveur Web
//PFI- Projet nodeJS d’application Web transactionnelle
//Date:13 septembre 2023
//Rafael Albaneze


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
// Librarie Multer pour le televersement des images.
const multer = require('multer');
const upload = multer({dest: './uploads'});
//const nodeJSpath = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        callback(null, file.fieldname);
    }
});

app.use(upload.any());


//Configuration de passaport
require('./config/passport')(passport);

let PORT = process.env.PORT;
if(PORT==null || PORT =="") {
    PORT =8000;
}
require('dotenv').config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
/**
 * Description: Gestionnaire d'événement pour afficher une erreur si la connexion à la base de données échoue.
 * Retour: Affiche une erreur en cas d'échec de la connexion à la base de données.
 */
db.on('error', (err) => {
    console.error('erreur de BD:', err);
});
mongoose.set('strictQuery', false);


// configuration de Express et des intergiciels
app.use(expressLayouts);

app.use('/css', express.static('./statiques/css'));
app.use('/js', express.static('./statiques/js'));
app.use('/images', express.static('./statiques/images'));

//Express body parser (interpreteur Express sur la form reçu en POST)
app.use(express.urlencoded( {extended: true }));


// configuration de la session Express (variables de session)
app.use(
    session({
        secret: 'un mot secret', resave: true, saveUninitialized: true,
        cookie:{
            maxAge:(1000*60*100)
        }
    })
);

//Intergiciel (middleware) Passaport
app.use(passport.initialize());
app.use(passport.session());

//Intergiciel connect flash
app.use(flash());


//Variables globales pour envoyer à passport 
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); 
    next();
});
app.use('/livres', require('./routes/livres'));  
app.use('/usagers', require('./routes/usagers'));  
app.use('/', require('./routes/index'));


app.set('views', './views');
app.set('view engine', 'ejs');


app.listen( PORT, console.log(`Serveur démarré sur le port ${PORT}`));