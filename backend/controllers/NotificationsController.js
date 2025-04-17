const { Notifications } = require('../models');

const getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.query.userid; // 🔥 we'll pass userid from frontend query params
        const page = parseInt(req.query.page) || 1;    // default to page 1
        const limit = parseInt(req.query.limit) || 10;  // default to 10 notifications
        const offset = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({ error: "Missing user ID" });
        }

        const notifications = await Notifications.findAndCountAll({
            where: { recipientid: userId },
            order: [['createdAt', 'DESC']], // newest notifications first
            limit: limit,
            offset: offset
        });

        res.status(200).json({
            totalNotifications: notifications.count,
            totalPages: Math.ceil(notifications.count / limit),
            currentPage: page,
            notifications: notifications.rows
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
      const notificationId = req.params.id;
  
      const notification = await Notifications.findByPk(notificationId);
  
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
  
      notification.is_read = true;
      await notification.save();
  
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  };
  
module.exports = { getNotificationsForUser, markNotificationAsRead };
