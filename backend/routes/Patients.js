const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/Authmiddleware');
const { getPatientData } = require('../controllers/patientController');

module.exports = router;