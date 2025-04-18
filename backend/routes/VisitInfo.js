const express = require('express')
const router = express.Router()

const{ updateInsertVisitInfo, getVisitInfo } = require('../controllers/visitInfoController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post('/inputvisitinfo/:appointmentId', validateToken('doctor'),validateToken('nurse'), updateInsertVisitInfo);

router.get('/getvisitinfo/:appointmentId', validateToken('doctor'), validateToken('nurse'), getVisitInfo);


module.exports = router;