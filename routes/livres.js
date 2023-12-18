/* *
//fichier des routes - Livres
 * Programmation Web 2
 * PFI- Projet nodeJS d’application Web transactionnelle
 * Rafael Albaneze
 * Date: 13 septembre 2023 
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const passaport = require('passport');
const Livres = require('../modeles/Livres');
const { estAuthentifie, estAdmin, estGestion } = require('../config/auth');
const mongoose = require('mongoose');
const nodeJSpath = require('path'); // On a deja la librerie Path dans les constantes (router.post)
const fs = require('fs').promises;
// const { default: mongoose } = require('mongoose');

const router = express.Router();

//Livres
router.get('/',estGestion, (requete, reponse)=>{
    const livres = requete.user;
    Livres.find({}).exec()
    .then(livres=>{
      reponse.render('listelivres', {
        'titre': 'liste des livres',
        'login': 'joseph@gmail.com',
        livres: livres,
        'livres': livres
    });
    })  
    .catch(err=> {throw err;})
    });


    router.get('/editer/:_id', estGestion, (requete, reponse)=>{
        const usager = requete.user;
        const _id = requete.params._id;
       Livres.findOne({'_id': _id})
        .then(monLivres=>{
            //Trouver un usager dans la BD

            reponse.render('modifLivres', {
                'titre': 'Modification du Livre' ,
                usager: usager,  
                _id: monLivres._id,
                
    
            });
        })
        .catch(err=> {
            console.log(err);
            requete.flash('error_msg', 'Erreu interne contactez l\'administrateur');
            reponse.redirect('/');
        });   
    });
    

//Livres
//livreModif
router.post('/livreModif', estGestion, (requete, reponse) => {
    const { _id,titreLivre, auteur, editeur, nbPages, langue, date, resume, prix, nomImage } = requete.body;
    
    const nouveauLivre = {_id:_id,
        titre:titreLivre, auteur:auteur, editeur:editeur, nbPages:nbPages, 
        langue:langue, date:date, resume:resume, prix:prix,nomImage:nomImage}
        Livres.findOneAndUpdate({_id: _id}, nouveauLivre)             
        .then(doc=>{
             requete.flash('success_msg', 'Usager modifié avec succès');
            reponse.redirect('/index');                    
         })
            .catch(err=>console.log('Modification na pas fonctionnée', err));
     });
     

router.post('/livreAdd', estGestion, (requete, reponse) => {
    const { titreLivre, auteur, editeur, nbPages, langue, date, resume, prix, nomImage } = requete.body;
    
    // Verifier si le livre est dans la base de données
    Livres.findOne({ 'titre': titreLivre })
        .then(livre => {
            if (livre) { // le livre est déjà dans la BD, on rejette l'ajout
                requete.flash('error_msg', 'Ce livre existe déjà');
                reponse.render('ajoutLivres', {
                    'titre1': 'Ajout d\'un livre',
                    titreLivre, auteur, editeur, nbPages, langue, date, resume, prix, nomImage
                });
            } else {
                let _id = new mongoose.Types.ObjectId();
                const nouveauLivre = new Livres({_id,
                    titre:titreLivre, auteur:auteur, editeur:editeur, nbPages:nbPages, langue:langue, date:date, resume:resume, prix:prix,nomImage:nomImage
                });
       
                nouveauLivre.save()
                    .then(() => {
                        requete.flash('success_msg', 'Nouveau Livre ajouté à la BD avec succès');
                        reponse.redirect('/index');                    
                    })
                    .catch(err => {
                        console.log('Insertion dans la BD n\'a pas fonctionné', err);
                        requete.flash('error_msg', 'Erreur lors de l\'insertion dans la BD');
                        reponse.redirect('/index'); 
                    });
            }
        })
        .catch(err => {
            console.log('Recherche dans la BD n\'a pas fonctionné', err);
            requete.flash('error_msg', 'Erreur lors de la recherche dans la BD');
            reponse.redirect('/index'); 
        });
});



//Suprimer Livres
router.get('/supprimer/:titre', estGestion, (requete, reponse)=>{
    const usager = requete.user;
    const titre = requete.params.titre;
    Livres.deleteOne({'titre': titre})
    .exec()
    .then(resultat=>{
        console.log(resultat);
        reponse.redirect('/livres');
    })
    .catch(err=>console.log(err));
});
           
router.get('/ajouter', estGestion, (requete, reponse)=>{
    const livres = requete.user;
    reponse.render('ajoutLivres', {
        'titre': 'Ajout d\'un livre' ,
        livres: livres,       
    });
});

module.exports = router;