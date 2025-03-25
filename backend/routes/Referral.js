const express = require("express");
const router = express.Router();
const { Referral, Patients, Doctors, Specialists } = require("../models");

// Get all pending referrals
router.get("/pending", async (req, res) => {
    const { specialist_id } = req.query;
    console.log("specialist_id:", req.query.specialist_id);
    try {
        const referrals = await Referral.findAll({
        where: { status: "pending", specialist_id},
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
});

// Approve or deny a referral
router.put("/:id", async (req, res) => {
    const { status } = req.body;
    try {
        const referral = await Referral.findByPk(req.params.id);
        if (!referral) return res.status(404).json({ error: "Referral not found" });
        referral.status = status;
        await referral.save();
        res.json({ message: `Referral ${status}` });
    } 
    catch (err) {
        console.error("Failed to update referral:", err);
        res.status(500).json({ error: "Failed to update referral" });
    }
});

module.exports = router;
