const express = require('express')
const router = express.Router()

const { registerUser, loginUser, creatingUser} = require('../controllers/usersController')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/creatingUser", creatingUser);

module.exports = router;