const express = require('express')
const router = express.Router()
const isAuthenticated  = require('../middleware/authentication')

const shopController = require('../controllers/shopController')
const csrf= require('../middleware/csrf')
//Not ->Dinamik olmayan yapılar, dinamik yapıların üstünde olmak zorunda.


router.get('/',csrf,shopController.getIndex);
router.get('/products/:productid',csrf,shopController.getProduct)

router.get('/categories/:categoryid',csrf,shopController.getProductsByCategoryId)
router.get('/products',csrf,shopController.getProducts)


router.get('/cart',isAuthenticated ,csrf,shopController.getCart)
router.post('/cart',isAuthenticated ,csrf,shopController.postCart)
router.post('/delete-cartitem',isAuthenticated ,csrf,shopController.postCartItemDelete)
router.get('/orders',isAuthenticated ,csrf,shopController.getOrders)
router.post('/create-order',isAuthenticated ,csrf,shopController.postOrder)




module.exports = router