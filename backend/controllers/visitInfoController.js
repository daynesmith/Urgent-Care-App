const { Op } = require("sequelize");
const {Doctors, Users, Appointments, Patients, Visitinfo} = require('../models');


//given the appointmentid from the row, input that as the appointmentid/ visitinfo id
const updateInsertVisitInfo = async (req, res) => {
   try {
        const { appointmentId } = req.params;
        const {doctornotes, notesforpatient} = req.body;

        const [visitinfo, created] = await Visitinfo.upsert({
            visitinfoid: appointmentId,
            doctornotes,
            notesforpatient,
        });

        await Appointments.update(
            { appointmentstatus: 'completed'},
            { where: {appointmentid: appointmentId }}
        );

        return res.status(200).json({
            message: created ? "Visit info created" : "Visit info updated",
            visitinfo,
        });

    } catch (error) {
        console.error("Error creating/updating visit info:", error);
        return res.status(500).json({ message: "Internal server error" });
        }
};

const getVisitInfo = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const visitInfo = await Visitinfo.findOne({
            where: { visitinfoid: appointmentId }
        });

        return res.status(200).json({ visitInfo });
    } catch (error) {
        console.error("Error fetching visit info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {updateInsertVisitInfo, getVisitInfo}; 