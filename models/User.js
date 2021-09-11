//model is where we enforce the business logic


//Constructor
let User = function(data){
    // "this" is mandatory.
    // that way everytime a new constructor is called,
    // the appropriate object (in this case User) will be
    // created
   this.data = data
}

//prototype makes sure that this function() this not get
//duplicated everytime a new User() model object is called.
User.prototype.signup = function(){

}

module.exports = User