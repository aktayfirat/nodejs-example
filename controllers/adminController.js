const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose')
const fs = require('fs') //Eski resimleri silmek için
const path = require('path')

//GET ALL  PRODUCTS
exports.getProducts = (req, res, next) => {

    Product.find({ userId: req.user._id })
        .populate('userId', 'name -_id')
        .select('name price imageUrl userId')
        .then((all_products) => {

            res.render('../views/admin/produtcs.ejs', {
                my_title: 'Admin Products',
                products: all_products,
                path: '/admin/products',
                my_action: req.query.action, //query-> linkin sonundaki QueryString'leri verir.
                user: req.user
            })

        }).catch((err) => {
            next(err)
        })
}

//GET ADD PRODUCT
exports.getAddProduct = (req, res, next) => {

    Category.find({})
        .then(categories => {

            let message = ''

            res.render('../views/admin/add-product', {
                my_title: 'Yeni Ürün',
                path: '/admin/add-product',
                categories: categories,
                user: req.user,
                errorMessage: message

            })

        }).catch(err => {
            next(err)
        })

}


//POST ADD PRODUCT
exports.postAddProduct = (req, res, next) => {

    const name = req.body.name
    const price = req.body.price
    const image = req.file
    const description = req.body.description
    const categories = req.body.categories

    if (!image) { //Eğer image seçilmediyse

        return res.render('../views/admin/add-product', {
            my_title: 'Yeni Ürün',
            path: '/admin/add-product',
            categories: categories,
            user: req.user,
            errorMessage: "Please choose an image..",
            inputs: {
                name: name,
                price: price,
                description: description
            }

        })
    }


    const product = new Product(
        {

            name: name,
            price: price,
            description: description,
            imageUrl: image.filename,
            userId: req.user,
            categories: categories,
            isActive: false,
            tags: ['MOBIL']

        }
    )

    product.save()
        .then(() => {
            console.log("ADDED")
            res.redirect('/admin/products')
        })
        .catch((err) => {

            console.log(err)
            if (err.name == 'ValidationError') {
                let message = ''
                for (field in err.errors) {
                    message += err.errors[field].message + "</br>";
                }

                res.render('../views/admin/add-product', {
                    my_title: 'New Product',
                    path: '/admin/add-product',
                    categories: categories,
                    user: req.user,
                    errorMessage: message,
                    inputs: {
                        name: name,
                        price: price,
                        description: description
                    }
                })
            }
            else {

                next(err)
            }

        })
}

//GET EDIT ONE PRODUCT
exports.getEditProduct = (req, res, next) => {
    const id = req.body.id

    Product.findById({ _id: req.params.productid, userId: req.user._id })
        
        .then(product => {

            if (!product) {
                return res.redirect('/')
            }

            return product
        })
        .then(product => {
            Category.find({}).then(categories => {

                categories = categories.map(category => {

                    if (product.categories) {
                        product.categories.find(item => {
                            if (item.toString() === category._id.toString()) {
                                category.selected = true
                            }
                        })
                    }

                    return category
                })

                res.render('admin/edit-product', {
                    my_title: 'EDIT PRODUCT',
                    path: '/admin/products',
                    product: product,
                    categories: categories,
                    categoryid: id,
                    user: req.user

                })
            })
        })
        .catch(err => {
            next(err)
        })
}


//POST-EDIT
exports.postEditProduct = (req, res, next) => {


    const id = req.body.id
    const name = req.body.name
    const price = req.body.price
    const imageUrl = req.file
    const description = req.body.description
    const categories = req.body.categories

    const product = {
        name: name,
        price: price,

        description: description,
        categories: categories
    }

    if (imageUrl) {

        product.imageUrl = imageUrl.filename
    }

    return Product.updateOne({ _id: id, userId: req.user._id }, {
        $set: product
    })

        .then(() => {
            console.log("Update successful")
            res.redirect('/admin/products?action=edit')
        })
        .catch(err => {
            next(err)
        })


}
//POST-DELETE
exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid

    Product.findByIdAndRemove({ _id: id, userId: req.user._id })
        .then(product => {
            if (!product) {
                return next(new Error("Not Found !"))
            }

            fs.unlink('public/img/' + product.imageUrl, err => {
                if (err) {
                    console.log(err)
                }
            });

            return Product.findByIdAndRemove({ _id: id, userId: req.user._id })
                .then((result) => {
                    if (result.deletedCount === 0) {
                        return next(new Error("Not Found !"))
                    }

                    console.log('Product deleted..')
                    res.redirect('/admin/products?action=delete')
                })

                .catch((err) => {
                    next(err)
                })
        })




    // WAY TWO
    // Product.findByIdAndRemove({_id:id, userId:req.user._id})
    //     .then((result) => {
    //         if(result.deletedCount === 0) {
    //                 return res.redirect('/')
    //         }
    //
    //         console.log('Product deleted..')
    //         res.redirect('/admin/products?action=delete')
    //     })
    //
    //     .catch((err) => {
    //         next(err)
    //     })

}

// GET ADD CATEGORY
exports.getAddCategory = (req, res) => {
    res.render('admin/add-category', {
        my_title: "Yeni Kategori",
        path: '/admin/add-category',
        user: req.user


    })

}

// POST CATEGORY
exports.postAddCategory = (req, res, next) => {
    const name = req.body.name
    const description = req.body.description

    const category = new Category({
        name: name,
        description: description
    })

    category.save()
        .then(() => {

            res.redirect('/admin/categories?action=create')
        })
        .catch(err => {
            next(err)
        })
}

// GET CATEGORIES
exports.getCategories = (req, res, next) => {

    Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'categories',
                as: 'products'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                num_of_products: { $size: '$products' }
            }
        }
    ]).then(categories => {
        res.render('../views/admin/categories.ejs', {
            my_title: 'Categories',
            path: '/admin/categories',
            categories: categories,
            my_action: req.query.action,
            user: req.user


        })
    })
        .catch(err => {
            next(err)
        })
}


// GET EDIT CATEGORY
exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryid)
        .then((category) => {
            res.render('../views/admin/edit-category.ejs', {
                my_title: 'Edit Category',
                path: '/admin/categories',
                category: category,
                user: req.user


            })
        })
        .catch(err => {
            next(err)
        })
}


// POST EDIT CATEGORY
exports.postEditCategory = (req, res, next) => {

    const id = req.body.id
    const name = req.body.name
    const description = req.body.description

    Category.findById(id)//id bilgisi ilen gelen category'i alalım
        .then(category => {
            category.name = name
            category.description = description

            return category.save()
        })
        .then(() => {
            res.redirect('/admin/categories?action=edit')
        })
        .catch(err => {
            next(err)
        })
}



exports.postDeleteCategory = (req, res, next) => {
    const id = req.body.categoryid

    Category.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/admin/categories?action=delete')
        })
        .catch(err => {
            next(err)
        })

}