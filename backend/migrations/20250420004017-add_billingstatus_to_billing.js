'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the billingstatus column to the Billing table
    await queryInterface.addColumn('Billings', 'billingstatus', {
      type: Sequelize.ENUM("Pending Review", "Approved"),
      allowNull: true,
      defaultValue: "Pending Review",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the billingstatus column in case of rollback
    await queryInterface.removeColumn('Billings', 'billingstatus');
  }
};

