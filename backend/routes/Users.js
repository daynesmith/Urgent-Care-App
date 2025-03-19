const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/usersController');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getUserProfile);  // ✅ Added route for fetching user data

module.exports = router;
