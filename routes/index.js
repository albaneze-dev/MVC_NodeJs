/**
 * //fichier des routes - Base
 * Programmation Web 2
 * PFI- Projet nodeJS d’application Web transactionnelle
 * Rafael Albaneze
 * Date: 13 septembre 2023 
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const passaport = require('passport');
const Usagers = require('../modeles/Usagers');
const Livres = require('../modeles/Livres');
const { estAuthentifie, estAdmin, estGestion } = require('../config/auth');
const mongoose = require('mongoose');
const nodeJSpath = require('path'); // On a deja la librerie Path dans les constantes (router.post)
const fs = require('fs').promises;
// const { default: mongoose } = require('mongoose');

const router = express.Router();

//Ne pas mettre le estAuthentifie ici
router.get('/', (requete, reponse)=>{
    reponse.render('login', {
        'titre': 'identification d\'utilisateur'       
    });
});


//Ne pas mettre le estAuthentifie ici
router.post('/userLogin', (requete, reponse, next) =>{
    passaport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/',
        failureFlash: true
    })(requete, reponse, next);
});

router.get('/', estAuthentifie, (requete, reponse)=>{
    const usager = requete.user;
    reponse.render('menu', {
        
        'usager': usager
    });
});

router.get('/index', estAuthentifie, (requete, reponse)=>{
    const usager = requete.user;
    reponse.render('menu', {
        
        'usager': usager
    });
});

router.get('/index.html', estAuthentifie, (requete, reponse)=>{
    const usager = requete.user;
    reponse.render('menu', {
        
        'usager': usager
    });
});



 router.get('*',(requete, reponse)=>{
    reponse.render('login', {
        'titre': 'identification d\'utilisateur'       
    });
});   

/**
 * La fonction conserver fichier deplace le fichier a conserver dans le
 * repertoire des images statiques et retourne le nom du fichier a mettre 
 * dans la BD.
 * @param {*} nomFichier  = le fichier original à déplacer avec son chemin
 * @param {*} filename = le nom du fichier à conserver dans le dossier statique
 */
const conserverFichier = async (nomFichier, filename) =>{
    const nomFichierComplet = nodeJSpath.join(__dirname, '..', nomFichier); 
    const nouveauNom = nodeJSpath.join(__dirname, '..', 'statiques', 'images', filename);
    try{
       await fs.rename(nomFichierComplet, nouveauNom); 
    }catch (e){
        console.log(e);
    }
    return filename;
}


/**
 * Fonction pour suprimer un fichier
 * @param {*} nomFichier c'est le nom du fichier a supprimer
 */
const supprimerFichier = async (nomFichier)=> {
    const nomFichierComplet = nodeJSpath.join(__dirname, '..', nomFichier);   
   try {
    await fs.rm(nomFichierComplet);
   }catch (e){
    console.log(e);
   }
}



module.exports = router;