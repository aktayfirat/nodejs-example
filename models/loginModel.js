const mongoose = require('mongoose')
const { isEmail } = require('validator')



const loginSchema = mongoose.Schema({
    email: {
        type: String,
        validate: [isEmail, 'Hatalı Email..']
    },
    password: {
        type: String,
        required: [true, `Parola girmelisiniz..`]
    }

})



module.exports = mongoose.model('Login', loginSchema)














/*
const getDb = require('../utility/database').getDb
const mongoDb = require('mongodb')


class User {

        constructor(name, email) {
            this.name = name
            this.email = email
        }


        save () {
            const db = getDb()
            return db.collection('users').insertOne(this)

        }


        static findById(userid) {
                const  db = getDb()
                return db.collection('users').findOne({_id: new mongoDb.ObjectID(userid)})
                    .then( user => {
                        return user
                    })
                    .catch(err => {
                        console.log(err)
                    })
        }

        static findByName(username) {
            const  db = getDb()
            return db.collection('users').
            findOne({name : username})
                .then( user => {
                    return user
                })
                .catch(err => {
                    console.log(err)
                })
        }

}
*/

//module.exports = User
