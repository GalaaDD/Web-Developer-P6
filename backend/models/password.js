//use of password-validator
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

// password schema, setting rules for the password's input
passwordSchema
    .is().min(8)                                    
    .is().max(100)                                  
    .has().uppercase()                              
    .has().lowercase()                              
    .has().digits(2)                              
    .has().symbols(1)                           
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

    //exportation of the schema we transform to be a model we could use throughout the project
module.exports =  passwordSchema