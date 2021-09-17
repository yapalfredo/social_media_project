const postsCollection = require('../db').db().collection('posts')
//Will treat any string as MongoDB ObjectID type
const ObjectID = require('mongodb').ObjectId
//We need this to pull Gravatar link
const User = require('./User')

let Post = function(data, userID, requestedPostId){
    this.data = data
    this.errors = []
    this.userID = userID
    this.requestedPostId = requestedPostId
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

Post.prototype.update = function(){
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleById(this.requestedPostId , this.userID)
            if (post.isVisitorOwner) {
                //actually update the db
                let status = await this.actuallyUpdate()
                resolve(status)
            } else {
                reject()
            }
        } catch {
            reject()
        }
    })
}

Post.prototype.actuallyUpdate = function(){
    return new Promise(async (resolve, reject) => {
        this.cleanUP()
        this.validate()
        if (!this.errors.length){
           await postsCollection.findOneAndUpdate({_id: new ObjectID(this.requestedPostId)}, {$set:{title: this.data.title, body: this.data.body}})
           resolve("success")
        } else {
            resolve("failure")
        }
    })
}

Post.reusablePostQuery = function(uniqueOperations, visitorId){
    return new Promise(async function (resolve, reject) {
    //checks if it's not a simple string of text or

    let aggOperations = uniqueOperations.concat([
        {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
        //This will only project the data you only wish to be displayed (1 means true; 0 means false)
        {$project: {
            title: 1,
            body: 1,
            createdDate: 1,
            authorId: "$author",
            author: {$arrayElemAt: ["$authorDocument", 0]}
        }}
    ])
    
    //aggregate lets us run multiple operations
    let posts = await postsCollection.aggregate(aggOperations).toArray()

        //Clean up author property for each post object
        posts = posts.map(function(post){
            
            post.isVisitorOwner = post.authorId.equals(visitorId)

            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post
        })
        resolve(posts)
    })
}

Post.findSingleById = function(id, visitorId){
    return new Promise(async function (resolve, reject) {
        //checks if it's not a simple string of text or
        //if it's not a valid MongoDb id
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        } 
            //aggregate lets us run multiple operations
            
        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectID(id)}}
        ], visitorId)

        if (posts.length) {
            //returns only the first item
            //console.log(posts[0])
            resolve(posts[0])
        } else {
            reject()
        }
    
    })
}

Post.findByAuthorById = function(authorId){
    return Post.reusablePostQuery([
        {$match: {author: authorId}},
        //1 is ascending order; -1 is descending order
        {$sort: {createdDate: -1}}
    ])
}

//this will make it available for controller
module.exports = Post