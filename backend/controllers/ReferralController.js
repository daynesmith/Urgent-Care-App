const { Referral, Patients, Doctors, Specialists } = require("../models");

// GET /referrals/pending
const getPendingReferrals = async (req, res) => {
  const { specialist_id } = req.query;
  if (!specialist_id || isNaN(specialist_id)) {
    return res.status(400).json({ error: "Invalid specialist_id" });
  }

  try {
    const referrals = await Referral.findAll({
      where: { status: "pending", specialist_id },
      include: [
        { model: Patients, as: "patient", attributes: ["firstname", "lastname"] },
        { model: Doctors, as: "doctor", attributes: ["firstname", "lastname"] },
        { model: Specialists, as: "specialist" }
      ]
    });
    res.json(referrals);
  } catch (err) {
    console.error("Failed to fetch referrals:", err);
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
};

// PUT /referrals/:id
const updateReferralStatus = async (req, res) => {
    const { status } = req.body;
  
    try {
      const referral = await Referral.findByPk(req.params.id);
  
      if (!referral) {
        return res.status(404).json({ error: "Referral not found" });
      }
  
      referral.status = status;
      await referral.save();
  
      res.json({ message: `Referral ${status}` });
    } catch (err) {
      console.error("Failed to update referral:", err);
      res.status(500).json({ error: "Failed to update referral" });
    }
  };
  
  const getApprovedReferralsForPatient = async (req, res) => {
    const { patient_id } = req.query;
    //console.log(patient_id, "is the patient id");
    if (!patient_id || isNaN(patient_id)) {
      return res.status(400).json({ error: "Invalid patient_id" });
    }
  
    try {
      const referrals = await Referral.findAll({
        where: { status: "approved", patient_id },
        include: [
          { model: Doctors, as: "doctor", attributes: ["firstname", "lastname"] },
          { model: Specialists, as: "specialist", attributes: ["firstname", "lastname", "user_id"] }
        ]
      });
  
      res.json(referrals);
    } catch (err) {
      console.error("Failed to fetch approved referrals:", err);
      res.status(500).json({ error: "Failed to fetch approved referrals" });
    }
  };
  

  const createReferral = async (req, res) => {
    const {
      patient_id,
      doctor_id,
      specialist_id,
      reason,
    } = req.body;
  
    // Validate required fields
    if (!patient_id || !doctor_id || !specialist_id || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      // Just create the referral directly since you have the IDs
      const referral = await Referral.create({
        patient_id,
        doctor_id,
        specialist_id,
        reason,
        status: "pending",
        // visit_info_id: null // add this later when implemented
      });
  
      return res.status(201).json(referral);
    } catch (err) {
      console.error("🔥 Error creating referral:", err);
      res.status(500).json({ error: "Could not create referral" });
    }
  };
  

module.exports = {
  createReferral,
  getPendingReferrals,
  updateReferralStatus,
  getApprovedReferralsForPatient
};
