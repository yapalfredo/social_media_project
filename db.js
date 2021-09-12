//This is for MongoDB connection
//npm install mongodb
const mongodb = require("mongodb")

//connection string from MongoDB dashboard
let connectionString = "mongodb+srv://todoappuser:todoappuser@cluster0.t01yh.mongodb.net/freedomapp?retryWrites=true&w=majority";
mongodb.MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){
   module.exports = client.db()
   const app = require("./app")
   app.listen(3000)
})