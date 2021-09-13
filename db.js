//This is for MongoDB connection
//npm install mongodb
const mongodb = require("mongodb")

//implemented environment variables
//npm install dotenv
const dotenv = require("dotenv")
dotenv.config()

//connection to MongoDB.
//with env
mongodb.MongoClient.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){
   module.exports = client
   const app = require("./app")
   app.listen(process.env.PORT)
})