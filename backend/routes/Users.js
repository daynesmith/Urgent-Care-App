const express = require('express')
const router = express.Router()

const { registerUser, loginUser, gettingApplications, creatingUser, updateApplicationStatus, sendingApplications} = require('../controllers/usersController')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getApplication", gettingApplications);
router.post("/creatingUser", creatingUser);
router.post("/sendingApplications", sendingApplications); // no multer needed
router.post("/updateApplicationStatus", updateApplicationStatus);

module.exports = router;