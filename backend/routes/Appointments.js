const express = require('express')
const router = express.Router()

const {validateToken} = require('../middlewares/Authmiddleware');
const { getPatientAppointments,getAllAppointments, createAppointmentReceptionist, updateAppointmentReceptionist, createAppointment, updateAppointment, getSingleAppointment } = require('../controllers/AppointmentsController')

router.get('/patient-appointments', validateToken('patient'), getPatientAppointments);  
router.post('/appointments-actions', validateToken('patient'), createAppointment);
router.post('/appointments-receptionists', validateToken('receptionist'), createAppointmentReceptionist);
router.post('/appointments-receptionists/:appointmentid', validateToken('receptionist'), updateAppointmentReceptionist);
router.post('/appointments-actions/:appointmentid', validateToken('patient'), updateAppointment);
router.get('/getappointments', getAllAppointments);
router.get('/appointment/:appointmentid', validateToken('patient'), getSingleAppointment);

module.exports = router;
