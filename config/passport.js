/**
 * //Configuration passport
 * Programmation Web 2
 * PFI- Projet nodeJS d’application Web transactionnelle
 * Rafael Albaneze
 * Date: 13 septembre 2023 
 */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Usagers = require('../modeles/Usagers');

module.exports = function(passaport) {
    passaport.use(
        new LocalStrategy( {usernameField: 'email'}, (email, password, done)=>{
            //recherche dans la bd
            Usagers.findOne({'email': email})
            .then(usager=>{
                if (!usager) {
                    return done(null, false, { message: 'Ce courriel n\'existe pas'});
                }
                // j'ai un usager  on verifie le mot de passe
                // on doit hacher le password avant de le comparer avec celui de la BD
                bcrypt.compare(password, usager.password, (err, sontEgaux)=>{
                    if (err) throw err;
                    if (sontEgaux){
                        return done(null, usager);
                    } 
                    else {
                        return done(null, false, { message: 'Mot de passe invalide'});
                    }
                });                
            })
        })
    );

    passaport.serializeUser(
        function(user, done){ done(null, user.email)}
    );
    passaport.deserializeUser(
        function(email, done) {
            Usagers.findOne({'email': email})
            .then(usager=>done(false, usager))
            .catch(err=>done(err, false));
        }
    );
}