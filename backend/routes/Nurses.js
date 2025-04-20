const express = require('express')
const router = express.Router()

const{syncNurses, getSingleAppointment, getAllSupplies,createVisitInfo,createUsedSupplies } = require('../controllers/nurseController')


// Define route to get a single appointment by its ID
router.get('/getSingleAppointment', getSingleAppointment);
router.get('/getAllSupplies', getAllSupplies);
router.post('/syncNurse', syncNurses);

router.post('/createVisitInfo', createVisitInfo);
router.post('/createUsedSupplies', createUsedSupplies);

module.exports = router;