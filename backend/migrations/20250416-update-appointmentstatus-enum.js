'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change ENUM values for appointmentstatus
    await queryInterface.changeColumn('Appointments', 'appointmentstatus', {
      type: Sequelize.ENUM('scheduled', 'waiting', 'in progress', 'completed'),
      allowNull: false,
      defaultValue: 'scheduled'
    });

    // Add new boolean column `isLate`
    await queryInterface.addColumn('Appointments', 'isLate', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false // optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert ENUM to string
    await queryInterface.changeColumn('Appointments', 'appointmentstatus', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Remove the isLate column
    await queryInterface.removeColumn('Appointments', 'isLate');

    // If using Postgres and ENUM was created, optionally drop it
    // await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_Appointments_appointmentstatus\";");
  }
};

