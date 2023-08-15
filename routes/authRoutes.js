const { Router } = require('express');
const authController = require('../controllers/authController')

const router = Router();

// signup with email and password -> creates new user in DB -> returns JWT Token
router.post('/signup', authController.signup_post);

// authenticate the user -> returns the JWT token
router.post('/authenticate', authController.authenticate_post);

// logout and clear the cookies
router.get('/logout', authController.logout_get);


module.exports = router;