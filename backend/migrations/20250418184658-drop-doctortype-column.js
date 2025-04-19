'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the 'doctortype' column
    await queryInterface.removeColumn('Doctors', 'doctortype');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the 'doctortype' column if the migration is rolled back
    await queryInterface.addColumn('Doctors', 'doctortype', {
      type: Sequelize.ENUM("PK", "Oncologist", "Neurologist", "Cardiologist"),
      allowNull: false,
      defaultValue: "PK",
    });
  },
};