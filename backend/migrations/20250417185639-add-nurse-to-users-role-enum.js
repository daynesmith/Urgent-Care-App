'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'patient', 'doctor', 'receptionist', 'specialist', 'nurse'),
      allowNull: false,
      defaultValue: 'patient',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'patient', 'doctor', 'receptionist', 'specialist'),
      allowNull: false,
      defaultValue: 'patient',
    });
  },
};