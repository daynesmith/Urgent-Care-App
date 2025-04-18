'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the ENUM constraint (PostgreSQL needs this)
    await queryInterface.changeColumn('Doctors', 'doctortype', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Doctors', 'doctortype', {
      type: Sequelize.ENUM("P", "Oncologist", "Neurologist", "Cardiologist"),
      allowNull: true,
      defaultValue: 'PK'
    });
  }
};

