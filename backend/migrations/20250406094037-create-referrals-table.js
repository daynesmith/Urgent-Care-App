'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Referrals', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      specialist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'denied'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      /* Uncomment out after for sure using VisitInfo_id
      visitinfo_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Set to false if every referral must have one
        references: {
          model: 'VisitInfos',
          key: 'visitinfoid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }*/
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Referrals');
  },
};
