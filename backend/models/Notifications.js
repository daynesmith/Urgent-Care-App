'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    notificationid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recipientid: DataTypes.INTEGER,
    senderid: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    type: DataTypes.ENUM('referral', 'appointment', 'general'),
    is_read: DataTypes.BOOLEAN
  }, {
    tableName: 'Notifications',
    timestamps: true
  });

  Notifications.associate = function(models) {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'recipientid',
      as: 'recipient',
      onDelete: 'CASCADE'
    });
  
    Notifications.belongsTo(models.Users, {
      foreignKey: 'senderid',
      as: 'sender',
      onDelete: 'SET NULL'
    });
  };
  return Notifications;
};
