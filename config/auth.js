/**
 * //Configuration Auth
 * Programmation Web 2
 * PFI- Projet nodeJS d’application Web transactionnelle
 * Rafael Albaneze
 * Date: 13 septembre 2023 
 */
module.exports ={
    estAuthentifie: function(req, rep, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Connectez-vous pour accéder au site');
        rep.redirect('/');
    },
    estAdmin: function(req, rep, next){
        if (req.isAuthenticated()){
            //verification du role admin
            let admin = req.user.roles.includes('admin');
            // let admin = req.user.roles.admin.includes('admin');
            if (admin) {
                return next();
            }else {
                req.flash("error_msg", "Vous devez etre admin pour acceder a cette page");
                rep.redirect('/menu');
            }
        } else {
            req.flash('error_msg', 'Connectez-vous pour accéder au site');
            rep.redirect('/');
        } 
        
    },
    estGestion: function(req, rep, next){
        if (req.isAuthenticated()){
            //verification du role admin
            let gestion = req.user.roles.includes('gestion');            
            if (gestion) {
                return next();
            }else {
                req.flash("error_msg", "Vous devez etre gestion pour acceder a cette page");
                rep.redirect('/menu');
            }
        } else {
            req.flash('error_msg', 'Connectez-vous pour accéder au site');
            rep.redirect('/');
        }
}
}
