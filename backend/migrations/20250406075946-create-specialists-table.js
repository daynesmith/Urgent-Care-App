'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Specialists', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users', // The table that the foreign key points to
          key: 'userid'   // The primary key column in the Users table
        }
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accepting_referrals: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Specialists');
  }
};


//drop the old specialist table and migrate the new one
//might need to remove old specialistid and old fk to specialistid, and re-add once you migrate the new specialists table....