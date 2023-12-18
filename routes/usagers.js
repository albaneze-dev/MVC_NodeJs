/* *
//fichier des routes - Usager
 * Programmation Web 2
 * PFI- Projet nodeJS d’application Web transactionnelle
 * Rafael Albaneze
 * Date: 13 septembre 2023 
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const passaport = require('passport');
const Usagers = require('../modeles/Usagers');
const { estAuthentifie, estAdmin, estGestion } = require('../config/auth');
const mongoose = require('mongoose');
const nodeJSpath = require('path'); // On a deja la librerie Path dans les constantes (router.post)
const fs = require('fs').promises;
// const { default: mongoose } = require('mongoose');

const router = express.Router();



router.get('/menu', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    Usagers.find({}).exec()
    .then(usagers=>{        
    reponse.render('listeusagers', {
        'titre': 'liste des usagers',
        'login': 'joseph@gmail.com',
        usager: usager,
        'listeUsagers': usagers
    });
    })  
    .catch(err=> {throw err;})
});



router.get('/logout', (requete, reponse)=>{
    requete.logOut(function(err){
        if (err) {
            return next(err);
        }
    });
    requete.flash('error_msg', 'Vous avez été déconnecté avec succès');
    reponse.redirect('/index');
});


router.get('/ajouter', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    reponse.render('ajoutUsager', {
        'titre': 'Ajout d\'un usager' ,
        usager: usager,       
    });
});


router.get('/editer/:email', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    const email = requete.params.email;
    Usagers.findOne({'email': email})
    .then(monUsager=>{
        //Trouver un usager dans la BD
        const admin = monUsager.roles.find(elem => elem == "admin");
        const gestion = monUsager.roles.find(elem => elem == "gestion");
        reponse.render('modifUsager', {
            'titre': 'Modification dun usager' ,
            usager: usager,  
            nom: monUsager.nom,
            email: monUsager.email,
            admin: admin,
            gestion: gestion,
            emailREADONLY: true

        });
    })
    .catch(err=> {
        console.log(err);
        requete.flash('error_msg', 'Erreu interne contactez l\'administrateur');
        reponse.redirect('/');
    });   
});


//Modifier Mot de Passe
router.get('/editerPWD/:email', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    const email = requete.params.email;
    Usagers.findOne({'email': email})
    .then(monUsager=>{
        //Trouver un usager dans la BD
        const admin = monUsager.roles.find(elem => elem == "admin");
        const gestion = monUsager.roles.find(elem => elem == "gestion");
        reponse.render('modifPassWord', {
            'titre': 'Modification dun usager' ,
            usager: usager,  
            nom: monUsager.nom,
            email: monUsager.email,
            admin: admin,
            gestion: gestion,
            emailREADONLY: true

        });
    })
    .catch(err=> {
        console.log(err);
        requete.flash('error_msg', 'Erreu interne contactez l\'administrateur');
        reponse.redirect('/');
    });   
});

//Modif Image
router.get('/editerImage/:email', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    const email = requete.params.email;
    Usagers.findOne({'email': email})
    .then(monUsager=>{
        //Trouver un usager dans la BD
        const admin = monUsager.roles.find(elem => elem == "admin");
        const gestion = monUsager.roles.find(elem => elem == "gestion");
        reponse.render('modifImage', {
            'titre': 'Modification dun usager' ,
            usager: usager,  
            nom: monUsager.nom,
            email: monUsager.email,
            admin: admin,
            gestion: gestion,
            emailREADONLY: true

        });
    })
    .catch(err=> {
        console.log(err);
        requete.flash('error_msg', 'Erreu interne contactez l\'administrateur');
        reponse.redirect('/');
    });   
});
//SuprimerUsager
router.get('/supprimer/:email', estAdmin, (requete, reponse)=>{
    const usager = requete.user;
    const email = requete.params.email;
    Usagers.deleteOne({'email': email})
    .exec()
    .then(resultat=>{
        console.log(resultat);
        reponse.redirect('/listeUsers');
    })
    .catch(err=>console.log(err));
});

//USER MODIF
router.post('/userModif',estAdmin, (requete, reponse)=>{
    const {nom, email, admin, gestion,normal} = requete.body;
    let erreurs = [];
    let roles = ["normal"];
    if (admin) 
        roles.push("admin");
      if  (gestion)
        roles.push("gestion");  
        
    if (!nom){
        erreurs.push({ msg: 'Remplir le Nom Svp!'});
    }
    if (erreurs. length > 0){
        reponse.render('modifUsager', {
            'titre': 'Modification d\'un usager',
            errors: erreurs,
            nom,            
            admin,
            email,
            gestion,
            normal,
            roles,
            emailREADONLY: true
        });

    } else {        
            const nouveauUsager = {nom: nom, roles:roles};   
            Usagers.findOneAndUpdate({email: email}, nouveauUsager)             
                .then(doc=>{
                     requete.flash('success_msg', 'Usager modifié avec succès');
                    reponse.redirect('/index');                    
                 })
                    .catch(err=>console.log('Modification na pas fonctionnée', err));
             }
 });

 router.post('/userModifPassword',estAdmin, (requete, reponse)=>{
    const {nom, email,password,password2} = requete.body;
    let erreurs = [];
        if (!nom || !email || !password || !password2){
            erreurs.push({ msg: 'Remplir toutes les cases du formulaire!'});
        }
        if (password !== password2){
            erreurs.push({msg: 'Les mots de passes ne correspondent pas'});
        }
        if (password.length <6) {
            erreurs.push({msg: 'Le mot de passe doit avoir au moins 6 caractères'});
        }
    
        if (erreurs. length > 0){
            reponse.render('modifPassword', {
                'titre': 'Modification d\'un usager',
                errors: erreurs,
                nom,            
                email,
                password,
                password2,
                emailREADONLY: true
            });

    } else {        
            const nouveauPwd = {password: password};
            bcrypt.genSalt(10, (err, salt)=>{
                if (err) throw err;
                bcrypt.hash(nouveauPwd.password, salt, (err, hash)=>{
                    if (err) throw err;
                    nouveauPwd.password = hash; 
                     Usagers.findOneAndUpdate({email: email}, nouveauPwd)             
                 .then(doc=>{
                    requete.flash('success_msg', 'Usager modifié avec succès');
                   reponse.redirect('/index');                    
                })
                   .catch(err=>console.log('Modification na pas fonctionnée', err));
                });
            });   
           
            }
});
         
    
router.post('/userModifImage',estAdmin, (requete, reponse)=>{
    const {nom, email, admin, gestion,fichier} = requete.body;
    //Multer appelle les ficheir dans cette ordre!
    const {originalname, destination, filename, size, path, mimetype} = requete.files[0];     
    const mimetypePermis = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    const maxFileSize =  1024*1024*2; 
    let erreurs = [];
    if (size > maxFileSize){
        erreurs.push({ msg: `La taille du fichier est trop grande ${maxFileSize} `})
    }else {
        //Cette erreur verifir les Types des formats permis
        if(!mimetypePermis.includes(mimetype)) {
            erreurs.push({ msg: `format de fich ier non accepté `});
        }
    }
    console.log(filename);
    console.log(path);
    if (erreurs. length > 0){
        supprimerFichier(path);
        reponse.render('modifImage', {
            'titre': 'Modification d\'un usager',
            errors: erreurs,
            nom,            
            admin,
            email,
            fichier,
            gestion,
            emailREADONLY: true
        });

    } else {        
            const nouveauPwd = {nomImage:fichier};   
            conserverFichier(path, filename);                                              
            nouveauPwd.nomImage = filename;                                            
            Usagers.findOneAndUpdate({email: email}, nouveauPwd)             
                 .then(doc=>{
                    requete.flash('success_msg', 'Usager modifié avec succès');
                   reponse.redirect('/index');                    
                })
                   .catch(err=>console.log('Modification na pas fonctionnée', err));
            }
});


router.post('/userAdd',estAdmin, (requete, reponse)=>{
    const {nom, email, password, password2, admin, gestion} = requete.body;
    //Multer appelle les ficheir dans cette ordre!
    const {originalname, destination, filename, size, path, mimetype} = requete.files[0];     
    const mimetypePermis = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    const maxFileSize =  1024*1024*2; 
    // 1024*1024*2; // 2 Mocts
    console.log('test:', admin, gestion);
    console.log('fichier:', originalname, destination, filename, size, path, mimetype);
    let erreurs = [];
    let roles = ["normal"];
    if (admin) 
        roles.push("admin");
        (gestion)
        roles.push("gestion");   
    console.log("roles:", roles); 
    if (size > maxFileSize){
        erreurs.push({ msg: `La taille du fichier est trop grande ${maxFileSize} `})
    }else {
        //Cette erreur verifir les Types des formats permis
        if(!mimetypePermis.includes(mimetype)) {
            erreurs.push({ msg: `format de fich ier non accepté `});
        }
    }

    if (!nom || !email || !password || !password2){
        erreurs.push({ msg: 'Remplir toutes les cases du formulaire!'});
    }
    if (password !== password2){
        erreurs.push({msg: 'Les mots de passes ne correspondent pas'});
    }
    if (password.length <6) {
        erreurs.push({msg: 'Le mot de passe doit avoir au moins 6 caractères'});
    }

    if (erreurs. length > 0){
        supprimerFichier(path);
        reponse.render('ajoutUsager', {
            'titre': 'Ajout d\'un usager',
            errors: erreurs,
            nom,
            email,
            password,
            password2,
            admin,
            gestion
        });
    } else {
        //Verifier si l'usager est dans la base de données
        Usagers.findOne({'email':email})
        .then(usager=>{
            if (usager) {// l'usage est déja dans la BD on rejette l'ajout
                erreurs.push({msg: 'Ce courriel existe dèja'});
                supprimerFichier(path);
                reponse.render('ajoutUsager', {
                    'titre': 'Ajout d\'un usager',
                    errors: erreurs,
                    nom,
                    email,
                    password,
                    password2,
                    admin, 
                    gestion    
                });
            } else {
                let _id = new mongoose.Types.ObjectId();
                const nouveauUsager = new Usagers({_id, nom, email, password, roles});
                //Hachage du mot de passe
                bcrypt.genSalt(10, (err, salt)=>{
                    if (err) throw err;
                    bcrypt.hash(nouveauUsager.password, salt, (err, hash)=>{
                        if (err) throw err;
                        nouveauUsager.password = hash; 
                        conserverFichier(path, filename);                                              
                        nouveauUsager.nomImage = filename;
                        nouveauUsager.save()
                        .then(usager=>{
                            requete.flash('success_msg', 'Nouvel usager ajouté à la BD avec succès');
                            reponse.redirect('/menu');                    
                        })
                        .catch(err=>console.log('Insertion dans la BD na pas fonctionnée', err));
                    });
                });
                
            }
        })
    }
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