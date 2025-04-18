const express = require('express')
const router = express.Router()

const{ syncNurses} = require('../controllers/nurseController')




router.post('/syncNurses', syncNurses);

module.exports = router;