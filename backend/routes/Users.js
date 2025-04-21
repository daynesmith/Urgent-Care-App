const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getSpeciality, updateEmployeeUsers, gettingApplications, getEmployeeUsers, creatingUser, updateApplicationStatus, clinicLocations, sendingApplications, getStaffUsers, getStaffShifts, getShiftsByStaffId} = require('../controllers/usersController')
const { validateToken } = require('../middlewares/Authmiddleware');


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getApplication", gettingApplications);
router.post("/creatingUser", creatingUser);
router.get("/getEmployeeUsers", getEmployeeUsers);
router.get('/getSpeciality/:userid', getSpeciality);
router.post("/updateEmployeeUsers", updateEmployeeUsers);
router.post("/sendingApplications", sendingApplications); 
router.post("/updateApplicationStatus", updateApplicationStatus);
router.get('/getStaffUsers', getStaffUsers); 
router.get('/getStaffShifts', validateToken(), getStaffShifts); 
router.get('/clinicLocations', clinicLocations); 
router.get('/getShiftsByStaffId/:staffid', getShiftsByStaffId); 

module.exports = router;