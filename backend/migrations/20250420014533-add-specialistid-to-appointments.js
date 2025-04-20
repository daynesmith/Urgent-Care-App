'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding specialistid column without the constraint
    await queryInterface.addColumn('Appointments', 'specialistid', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Set to true so that this field can be optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if the migration is rolled back
    await queryInterface.removeColumn('Appointments', 'specialistid');
  }
};
