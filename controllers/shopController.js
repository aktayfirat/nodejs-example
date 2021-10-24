const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')


//_______________________________________  ANASAYFA ________________________
exports.getIndex = (req, res, next) => {

    Product.find()
        .then(products => {
            return products
        })
        .then(products => {
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
                        num_of_products: { $size: '$products' }
                    }
                }
            ]).then(categories => {
                res.render('../views/shop/index.ejs', {
                    my_title: 'Shopping',
                    products: products,
                    path: '/',
                    categories: categories,
                    user: req.user


                })

            })
        })

        .catch((err) => {
            next(err)
        })

}

//_______________________________________  TÜM HEPSİ ________________________
exports.getProducts = (req, res, next) => {

    Product.find()
        .then(all_products => {
            return all_products
        })
        .then(all_products => {
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
                        num_of_products: { $size: '$products' }
                    }
                }
            ]).then(categories => {
                res.render('../views/shop/products.ejs', {
                    my_title: 'Products Page',
                    products: all_products,
                    path: '/products',
                    categories: categories,
                    user: req.user

                })

            })
        })
        .catch((err) => {
            next(err)
        })
}

//_______________________________________  KATEGORİYE GÖRE GETİR ________________________
exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid
    const model = []

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
                num_of_products: { $size: '$products' }
            }
        }
    ])
        .then((categories) => {
            model.categories = categories
            return Product.find({
                categories: categoryid
            })

        })
        .then((products) => { //returnden geleni products olarak karşılıyoruz
            res.render('../views/shop/products.ejs', {
                my_title: 'Products',
                products: products,
                categories: model.categories,
                selectedCategory: categoryid,
                path: '/products',
                user: req.user


            })
        })
        .catch((err) => {
            next(err)
        })

}


//_______________________________________  DETAY / TEK ÜRÜN( ID ) ________________________
exports.getProduct = (req, res, next) => {

    Product
        //.findById(req.params.productid)
        .findOne({ _id: req.params.productid })
        .then((product) => {
            res.render('shop/product-detail.ejs', {
                my_title: product.name,
                product: product, //objenin kendisi, dizi olmadan gelir -> [0][0] ile..
                path: '/details',
                user: req.user

            })
        })
        .catch((err) => {
            next(err)
        })

}

//_______________________________________  KART  _________________________________
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate() //Sorguyu tekrar db'ye gönderip, yukarda ilişkili olan datayı  burdan alalım
        .then(user => {
            res.render('../views/shop/cart.ejs', {
                title: 'Cart',
                path: '/cart',
                products: user.cart.items,
                my_title: 'Cart',
                user: req.user

            });
        }).catch(err => {
            next(err)
        });
}

exports.postCart = (req, res, next) => {

    const productId = req.body.productId


    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            next(err)
        })

}

//_______________________________________  KARTTAN Sİl  _________________________________

exports.postCartItemDelete = (req, res) => {
    const productid = req.body.productid
    req.user.deleteCartItem(productid)
        .then(() => {
            res.redirect('/cart')
        })
}


//_______________________________________  SİPARİŞLERİ GETİR  _________________________________
exports.getOrders = (req, res, next) => {

    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            console.log(orders)
            res.render('../views/shop/orders.ejs', {
                my_title: 'Orders Page',
                path: '/orders',
                orders: orders,
                user: req.user


            })
        })
        .catch(err => {
            next(err)
        })



}

exports.postOrder = (req, res, next) => {

    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    name: req.user.name,
                    email: req.user.email

                },
                items: user.cart.items.map(p => {
                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl

                        },
                        quantity: p.quantity
                    }
                })

            })

            return order.save()

        })

        .then(() => {  //Cart temizleme
            return req.user.clearCart()
        })

        .then(() => {
            res.redirect('/orders')
        })

        .catch(err => {
            next(err)
        })

}