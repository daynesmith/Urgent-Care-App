'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      notificationid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      recipientid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // ✅ assumes you have a Users table
          key: 'userid'
        },
        onDelete: 'CASCADE'
      },
      senderid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',  // ✅ sender is also a user
          key: 'userid'
        },
        onDelete: 'SET NULL'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('referral', 'appointment', 'general'),
        defaultValue: 'general'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
  }
};
