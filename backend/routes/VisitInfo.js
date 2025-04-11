const express = require('express')
const router = express.Router()

const{ updateInsertVisitInfo, getVisitInfo } = require('../controllers/visitInfoController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/inputvisitinfo/:appointmentId', validateToken('doctor'), updateInsertVisitInfo);

router.get('/getvisitinfo/:appointmentId', validateToken('doctor'), getVisitInfo);


module.exports = router;