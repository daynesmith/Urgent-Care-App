'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Appointments', 'appointmentstatus', {
      type: Sequelize.ENUM('scheduled', 'waiting', 'in progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled'
    });

    await queryInterface.addColumn('Appointments', 'isLate', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false // optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Appointments', 'appointmentstatus', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.removeColumn('Appointments', 'isLate');

    // If using Postgres and ENUM was created, optionally drop it
    // await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_Appointments_appointmentstatus\";");
  }
};

