const express = require('express');
const router = express.Router();
const { registerReceptionist} = require('../controllers/receptionistController'); // Import the controller

router.post('/register', registerReceptionist);

module.exports = router;