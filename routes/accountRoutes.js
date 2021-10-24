const express = require('express')
const router = express.Router()

const accountController = require('../controllers/accountController.js')
const csrf = require('../middleware/csrf')

router.get('/login',csrf,accountController.getLogin)
router.post('/login',csrf,accountController.postLogin)
router.get('/logout',csrf,accountController.getLogout)


router.get('/register',csrf,accountController.getRegister)
router.post('/register',csrf,accountController.postRegister)


router.get('/reset-password',csrf,accountController.getReset)
router.post('/reset-password',csrf,accountController.postReset)


router.get('/reset-password/:token',csrf,accountController.getNewPassword)
router.post('/new-password',csrf,accountController.postNewPassword) //Form action -> /new-password 



module.exports = router


