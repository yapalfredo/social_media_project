const usersCollection = require('../db').db().collection("users")
const followsCollection = require('../db').db().collection("follows")
const ObjectID = require('mongodb').ObjectId

let Follow = function(followedUsername, authorId){
    this.followedUsername = followedUsername
    this.authorId = authorId
    this.errors = []
}

Follow.prototype.cleanUp = function(){
    if (typeof(this.followedUsername) != "string") {this.followedUsername = ""}
}

Follow.prototype.validate = async function(action){
    //Followed Username must exist in the database
    let followedAccount = await usersCollection.findOne({username: this.followedUsername})
    if (followedAccount) {
        this.followedId = followedAccount._id
    } else {
        this.errors.push("You cannot follow a user which doesn't exist.")
    }

    let doesFollowAlreadyExist = await followsCollection.findOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})

    if (action == "create"){
        if (doesFollowAlreadyExist) {
            this.errors.push("You are already following this user.")
        }
    }

    if (action == "delete"){
        if (!doesFollowAlreadyExist) {
            this.errors.push("You can't unfollow someone that you are not following.")
        }
    }

    //should not be able to follow own id
    if (this.followedId.equals(this.authorId)) {this.errors.push("You cannot follow yourself.")}
}

Follow.prototype.create = function(){
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("create")

        if (this.errors.length) {
            reject(this.errors)
        }else {
            await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        }
    })
}

Follow.prototype.delete = function(){
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("delete")

        if (this.errors.length) {
            reject(this.errors)
        }else {
            await followsCollection.deleteOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        }
    })
}

Follow.isVisitorFollower = async function(followedId, visitorId){
     let followDoc = await followsCollection.findOne({followedId: followedId, authorId: new ObjectID(visitorId)})
     if (followDoc) {
        return true
     } else {
        return false
     }
}

module.exports = Follow