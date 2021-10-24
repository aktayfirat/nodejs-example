require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const my_pw = process.env.PASSWORD

let _db

const mongoConnect = (callback) => {
       // MongoClient.connect('mongodb://localhost/node-app')
    MongoClient.connect(`mongodb+srv://craxx3131:${my_pw}@btkapp.in0gt.mongodb.net/node-appDB?retryWrites=true&w=majority`)
        .then(client => {
            console.log("Connected !")
            _db = client.db()

            callback()

        })
        .catch((err) => {
            console.log(err)
            throw err
        })


}

const getDb = () => {
    if(_db){
            return _db
    }else {
        throw 'There is no a database.'
    }
}



exports.mongoConnect = mongoConnect
exports.getDb = getDb