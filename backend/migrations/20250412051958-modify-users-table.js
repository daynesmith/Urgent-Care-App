'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false   
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateofbirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordhash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'patient', 'doctor', 'receptionist', 'specialist'),
        allowNull: false,
        defaultValue: 'patient',
      },
      qualifications: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      certifications: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coverletter: {
        type: Sequelize.TEXT,
        allowNull: true, 
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        allowNull: true,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

};
