const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün ismi girmelisiniz'],
        minlength: [5, "Ürün ismi min 5 karakter olmalı"],
        maxlength: [255, "Ürün  ismi en az 255 karakter olmalı"],
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: function () {
            return this.isActive //Oluşturulan nesnenin  aktif alanı true ise, fiyat alanını girmek zorunda
        }
        ,
        minlength: 0,
        maxlength: 50000,
        get: value => Math.round(value), //ürünler gelince bunu göster ve yuvarla.
        set: value => Math.round(value) //product -> üzerinden fiyata değer atınca bu çalışır dbye round kayıt
    },
    description: {
        type: String,
        minlength: 10
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;//Mutlaka değer olucak ve  > 0
            },
            message: "Ürün için en az 1 tane etiket giriniz"
        }
    },
    isActive: {
        type: Boolean
    },

    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }]

})


module.exports = mongoose.model('Product', productSchema)
