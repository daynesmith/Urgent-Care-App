const express = require("express");
const router = express.Router();
const { Specialists } = require("../models");

router.get("/", async (req, res) => {
  try {
    const specialists = await Specialists.findAll({
      attributes: ["user_id", "firstname", "lastname", "specialty", "department"]
    });
    res.json(specialists);
  } catch (err) {
    console.error("Error fetching specialists:", err);
    res.status(500).json({ error: "Failed to fetch specialists" });
  }
});

module.exports = router;
