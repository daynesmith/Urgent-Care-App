const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const { registerUser, loginUser, creatingUser, updateApplicationStatus, getStaffUsers, getStaffShifts} = require('../controllers/usersController')
=======
const { registerUser, loginUser, gettingApplications, creatingUser, updateApplicationStatus, sendingApplications, getStaffUsers, getStaffShifts, clinicLocations} = require('../controllers/usersController')
>>>>>>> d766ca2beebdb5cf91bd18860d2f56acaf358a26
const { validateToken } = require('../middlewares/Authmiddleware');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/creatingUser", creatingUser);
<<<<<<< HEAD
=======
router.post("/sendingApplications", sendingApplications); 
>>>>>>> d766ca2beebdb5cf91bd18860d2f56acaf358a26
router.post("/updateApplicationStatus", updateApplicationStatus);
router.get('/getStaffUsers', getStaffUsers); 
router.get('/getStaffShifts', validateToken(), getStaffShifts); 
router.get('/clinicLocations', clinicLocations); 

module.exports = router;