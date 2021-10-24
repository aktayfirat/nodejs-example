const mongoose = require('mongoose')
const Product = require('./productModel.js')
const { isEmail } = require('validator')



const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [isEmail, 'invalid email']
    },
    resetToken: String,
    resetTokenExpiration: Date, //Zaman vericez Tokene...
    isAdmin: {
        type: Boolean,
        default: false

    },
    cart: { //Kullanıcının Kart objesi
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

//_________________________________________ addToCart () _________________________________
userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });

    const updatedCartItems = [...this.cart.items];

    let itemQuantity = 1;
    if (index >= 0) {
        // cart zaten eklenmek istenen product var: quantity'i arttır
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity;

    } else {
        // updatedCartItems!a yeni bir eleman ekle
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity
        });
    }

    this.cart = {
        items: updatedCartItems
    }

    return this.save();
}

//_________________________________________ getCart () _________________________________
userSchema.methods.getCart = function (product) {

    const ids = this.cart.items.map(i => {
        return i.productId;
    });

    return Product
        .find({
            _id: {
                $in: ids
            }
        })
        .select('name price imageUrl')
        .then(products => {
            return products.map(p => {
                return {
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString()
                    }).quantity
                }
            });
        });

}


//______________________________________ deleteCartItem () _________________________
userSchema.methods.deleteCartItem = function (productid) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productid.toString()
    })

    this.cart.items = cartItems
    return this.save()

}


//______________________________________ clearCart () _________________________
userSchema.methods.clearCart = function () {

    this.cart = { items: [] }
    return this.save()
}




module.exports = mongoose.model('User', userSchema)














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
