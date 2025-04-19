const express = require('express')
const router = express.Router()
const { registerUser, loginUser, gettingApplications, creatingUser, updateApplicationStatus, sendingApplications, getStaffUsers, getStaffShifts, clinicLocations} = require('../controllers/usersController')
const { validateToken } = require('../middlewares/Authmiddleware');


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getApplication", gettingApplications);
router.post("/creatingUser", creatingUser);
router.post("/sendingApplications", sendingApplications); 
router.post("/updateApplicationStatus", updateApplicationStatus);
router.get('/getStaffUsers', getStaffUsers); 
router.get('/getStaffShifts', validateToken(), getStaffShifts); 
router.get('/clinicLocations', clinicLocations); 

module.exports = router;