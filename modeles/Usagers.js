// schéma de données pour les usagers utilisant mongoose 7 (pas de callback...)
// Rafael Albaneze
//Date: 13 septembre 2023 

const mongoose = require('mongoose');

let schemaUsagers = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },  
    nomImage: {
        type: String,
        required: true,
        defaut: 'gamer.png'
    },
    date: {
        type: Date,
        defaut: Date.now
    },
    roles: {
        type: Array,
        require: true,
        default: ["normal"]
    }
});

let Usagers = module.exports = mongoose.model('usagers', schemaUsagers);
