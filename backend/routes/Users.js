const express = require('express')
const router = express.Router()
const { registerUser, loginUser, creatingUser, updateApplicationStatus, getStaffUsers, getStaffShifts} = require('../controllers/usersController')
const { validateToken } = require('../middlewares/Authmiddleware');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/creatingUser", creatingUser);
router.post("/updateApplicationStatus", updateApplicationStatus);
router.get('/getStaffUsers', getStaffUsers); 
router.get('/getStaffShifts', validateToken(), getStaffShifts); 

module.exports = router;