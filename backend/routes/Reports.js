// routes/reports.js
const express = require('express');
const router = express.Router();
const { Doctors, Appointments, Shifts, Users, sequelize } = require('../models');
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

router.get('/shift-info', async (req, res) => {
  const { role, location, date, lastname } = req.query;
  
  const whereClause = {};

  if (role) whereClause['$staff.role$'] = role;  // Assuming role is on the Users table
  if (location) whereClause.cliniclocation = location;
  if (date) whereClause.date = date;

  // For last name filter, we use MySQL's case-insensitive LIKE
  if (lastname) whereClause['$staff.lastname$'] = { [Op.like]: `%${lastname.toLowerCase()}%` };

  try {
    const shifts = await Shifts.findAll({
      where: whereClause,
      include: {
        model: Users,
        as: "staff",  // Ensuring you are joining the staff (users) table
        attributes: ['firstname', 'lastname', 'role'],
      },
    });
    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shift report:", err);
    res.status(500).json({ error: "Failed to fetch shift data." });
  }
});

module.exports = router;
