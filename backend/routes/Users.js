const express = require('express')
const router = express.Router()
const { Users } = require('../models')

const bcrypt = require('bcrypt');
const {sign} = require('jsonwebtoken');
//const {validateToken} = require('../middlewares/AuthMiddleware')

const { registerUser, loginUser } = require('../controllers/usersController')

router.post("/register", registerUser);

router.post("/login", loginUser);


module.exports = router;