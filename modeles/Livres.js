// schéma de données pour les livres utilisant mongoose 7 (pas de callback...)
// Rafael Albaneze
//Date: 13 septembre 2023 

const mongoose = require ('mongoose');

let schemaLivre = mongoose.Schema({

_id:{
    type:String,
    required:true
},
titre:{
    type:String,
    required:true
},
auteur: {
    type:String,
    required:true
},
editeur: {
    type:String,
    required:true
},
nbPages: {
    type:Number,
    required:true
},
langue: {
    type:String,
    required:true
},
prix: {
    type:Number,
    required:true
},
date: {
    type:String,
    required:true
},
nomImage: {
    type: String,
    required: true,
    defaut: 'https://www.usnews.com/object/image/00000187-33bb-d15e-a5bf-3fbbc1820000/gettyimages-1455958786.jpg?update-time=1680200206720&size=responsive970'
},
resume:{
    type:String,
    required:true
}

});

let Livres = module.exports = mongoose.model('livres', schemaLivre);
