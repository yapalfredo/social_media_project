const postsCollection = require('../db').db().collection('posts')
//Will treat any string as MongoDB ObjectID type
const ObjectID = require('mongodb').ObjectId

let Post = function(data, userID){
    this.data = data
    this.errors = []
    this.userID = userID
}

Post.prototype.cleanUP = function(){
    if (typeof(this.data.title) != "string") {
        this.data.title = ""
    }
    if (typeof(this.data.body) != "string") {
        this.data.body = ""
    }

    //Get rid of bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userID)
    }
}

Post.prototype.validate = function(){
    if (this.data.title == "") {
        this.errors.push("You must provide a title")
    }
    if (this.data.body == "") {
        this.errors.push("You must provide a post content")
    }
}

Post.prototype.createPost = function(){
    return new Promise((resolve, reject) =>{
        this.cleanUP()
        this.validate()

        if (this.errors.length > 0) {
            //Send an error
            reject(this.errors)
        } else {
            //Save the post content to MongoDB
            postsCollection.insertOne(this.data).then(() => {
                resolve(this.data)
            }).catch(() =>{
                this.errors.push("Error: Something happened during the saving of post.")
                reject(this.errors)
            })
        }
    })
}

//this will make it available for controller
module.exports = Post