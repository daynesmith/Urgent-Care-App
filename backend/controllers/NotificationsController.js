const { Notifications, Users } = require('../models'); 
const { Op } = require("sequelize");


const getReceptionistNotifications = async (req, res) => {

      try {
        console.log("******************************");
        console.log("******************************");

        console.log(req.user);
        const { email } = req.user;

        const user = await Users.findOne({
          where: { email },
          attributes: ['userid'], 
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const notifications = await Notifications.findAll({
          where: { recipientid: user.userid }, 
          include: [
            {
              model: Users,
              as: 'recipient',
              attributes: ['firstname', 'lastname', 'email'],
            },
          ],
          order: [['createdAt', 'DESC']], // Order by the most recent notifications
        });
    
        res.json(notifications);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }

};

module.exports = { getReceptionistNotifications };
