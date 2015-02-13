var mongoose = require('mongoose');
var email_regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;

// CUSTOM VALIDATION ON User Name length //
 function nameLength(val) {
    if(val === undefined) {
        return false; 
    } else if(val.length < 3){
        return false;
    } else {
        return true;
    }
 }

 // CUSTOM VALIDATION on password length //
function passwordLength(val) {
    if(val === undefined){
        return false;
    }else if(val.length < 8){
        return false;
    }else {
        return true;
    }
}
// CREATE SCHEMA WITH CUSTOM ERROR VALIDATION//
var blistSchema = new mongoose.Schema({
     user_name: {type: String, validate: nameLength },
     email_address: { type: String, lowercase: true, unique:true, validate: email_regExp},  
     password: {type: String, validate: passwordLength },
     bucket: Array,
 });

mongoose.model('bklist', blistSchema);

