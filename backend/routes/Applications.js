const express = require('express')
const router = express.Router()

const {updateApplicationStatus} = require('../controllers/applicationsController')

router.post("/updateApplicationStatus", updateApplicationStatus);

module.exports = router;