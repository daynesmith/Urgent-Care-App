const express = require('express')
const router = express.Router()

const {validateToken} = require('../middlewares/Authmiddleware');
const { getPatientAppointments,getAllAppointments, createAppointmentReceptionist, updateAppointmentReceptionist, updateStatus, createAppointment, updateAppointment, getSingleAppointment, cancelAppointment, rescheduleAppointment, createAppointmentSpecialist } = require('../controllers/AppointmentsController')


router.get('/patient-appointments', validateToken('patient'), getPatientAppointments);  
router.post('/appointments-actions', validateToken('patient'), createAppointment);
router.post('/appointments-receptionists', validateToken('receptionist'), createAppointmentReceptionist);
router.post('/appointments-receptionists/:appointmentid', validateToken('receptionist'), updateAppointmentReceptionist);
router.post('/appointments-actions/:appointmentid', validateToken('patient'), updateAppointment);
router.get('/getappointments', getAllAppointments);
router.post('/updateStatus', updateStatus);
router.get('/appointment/:appointmentid', validateToken('patient'), getSingleAppointment);
router.delete('/cancel-appointment/:appointmentid', validateToken('patient'), cancelAppointment );
router.patch('/reschedule-appointment/:appointmentid', validateToken('patient'), rescheduleAppointment );

router.post('/createAppointmentsSpecialists', validateToken('patient'), createAppointmentSpecialist);

module.exports = router;
