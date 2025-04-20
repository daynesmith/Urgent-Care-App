// routes/reports.js
const express = require('express');
const router = express.Router();
const { Doctors, Appointments, sequelize } = require('../models');
const { Op } = require('sequelize');

router.get('/doctor-appointments', async (req, res) => {
  try {
    const { start, end } = req.query;

    let whereCondition = {};
    if (start && end) {
      whereCondition = {
        requesteddate: {
          [Op.between]: [start, end],
        },
      };
    }

    const results = await Doctors.findAll({
      attributes: [
        'doctorid',
        [sequelize.fn('CONCAT', sequelize.col('firstname'), ' ', sequelize.col('lastname')), 'doctor_name'],
        [sequelize.fn('COUNT', sequelize.col('appointments.appointmentid')), 'total_appointments'],
      ],
      include: [
        {
          model: Appointments,
          as: 'appointments',
          attributes: [],
          where: whereCondition,
          required: false, // include doctors even if they have 0 appointments
        },
      ],
      group: ['Doctors.doctorid'],
      order: [['doctorid', 'ASC']],
      raw: true,
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching doctor appointment report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
