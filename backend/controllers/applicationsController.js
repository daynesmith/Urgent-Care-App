const {Applications} = require('../models'); // Adjust the path according to your project structure




const updateApplicationStatus = async (req, res) => {
    const { status, email } = req.body;
  
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }
  
    try {
      const app = await Applications.findOne({ where: { email } });
  
      if (!app) {
        return res.status(404).json({ error: "Application not found." });
      }
  
      app.status = status;
      await app.save();
  
      res.json({
        message: `Application status updated to ${status}.`,
        application: app,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};
  



module.exports = {updateApplicationStatus};