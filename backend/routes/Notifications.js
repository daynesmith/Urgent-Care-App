const express = require('express')
const router = express.Router()

const {validateToken} = require('../middlewares/Authmiddleware');
const { getReceptionistNotifications } = require('../controllers/NotificationsController');

router.get('/receptionist', validateToken('receptionist'), getReceptionistNotifications);


module.exports = router;