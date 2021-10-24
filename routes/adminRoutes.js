const express = require('express')
const router = express.Router()
const  adminController = require('../controllers/adminController')
const  isAdmin = require('../middleware/isAdmin')
const csrf = require('../middleware/csrf')


router.get('/add-product', isAdmin ,csrf,adminController.getAddProduct);

router.post('/add-product',csrf, isAdmin ,adminController.postAddProduct);
router.get('/products', isAdmin,csrf,adminController.getProducts);

// edit product
router.get('/products/:productid',csrf, isAdmin ,adminController.getEditProduct);
router.post('/products',csrf, isAdmin ,adminController.postEditProduct);
router.post('/delete-product',csrf, isAdmin , adminController.postDeleteProduct)

//category
router.get('/add-category',csrf, isAdmin ,adminController.getAddCategory)
router.post('/add-category',csrf, isAdmin ,adminController.postAddCategory)
router.post('/delete-category',csrf, isAdmin ,adminController.postDeleteCategory)

//categories
router.get('/categories',csrf, isAdmin ,adminController.getCategories)
router.get('/categories/:categoryid',csrf, isAdmin ,adminController.getEditCategory)
router.post('/categories',csrf, isAdmin ,adminController.postEditCategory)


module.exports = router
