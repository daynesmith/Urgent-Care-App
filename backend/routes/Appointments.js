const express = require('express')
const router = express.Router()

const {validateToken} = require('../middlewares/Authmiddleware');
const { getPatientAppointments, createAppointment, updateAppointment } = require('../controllers/AppointmentsController')

router.get('/patient-appointments', validateToken('patient'), getPatientAppointments);  
router.post('/appointments-actions', validateToken('patient'), createAppointment);
//router.post('/appointments-receptionists', validateToken('receptionist'), createAppointmentReceptionist);
//router.post('/appointments-receptionists/:appointmentid', validateToken('receptionist'), updateAppointment);
router.post('/appointments-actions/:appointmentid', validateToken('patient'), updateAppointment);

module.exports = router;
