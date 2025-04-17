const express = require('express')
const router = express.Router()
const { registerUser, loginUser, gettingApplications, creatingUser, updateApplicationStatus, sendingApplications, getStaffUsers, getStaffShifts} = require('../controllers/usersController')
const { validateToken } = require('../middlewares/Authmiddleware');

<<<<<<< HEAD
const { registerUser, loginUser, creatingUser} = require('../controllers/usersController')
=======
>>>>>>> upstream/main

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/creatingUser", creatingUser);
<<<<<<< HEAD
=======
router.post("/sendingApplications", sendingApplications); // no multer needed
router.post("/updateApplicationStatus", updateApplicationStatus);
router.get('/getStaffUsers', getStaffUsers); 
router.get('/getStaffShifts', validateToken(), getStaffShifts); 
>>>>>>> upstream/main

module.exports = router;