const express = require('express');
const router = express.Router();

const { getNotificationsForUser, markNotificationAsRead } = require('../controllers/notificationsController');

router.get('/', getNotificationsForUser);
router.put('/:id/read', markNotificationAsRead);

module.exports = router;
