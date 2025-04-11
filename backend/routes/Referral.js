const express = require("express");
const router = express.Router();
const { Referral, Patients, Doctors, Specialists, /*Add VisitInfo once updated by charlize*/ } = require("../models");
const {createReferral, getPendingReferrals, updateReferralStatus} = require("../controllers/ReferralController");
  
router.get("/pending", getPendingReferrals);
router.put("/:id", updateReferralStatus);
router.post("/", (req, res, next) => {
    next(); // Pass to the actual controller
  }, createReferral);


module.exports = router;
