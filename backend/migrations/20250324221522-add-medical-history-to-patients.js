'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patients', 'chronic_conditions', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'past_surgeries', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'current_medications', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'allergies', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'lifestyle_factors', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'vaccination_status', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('patients', 'vaccination_status');
    await queryInterface.removeColumn('patients', 'lifestyle_factors');
    await queryInterface.removeColumn('patients', 'allergies');
    await queryInterface.removeColumn('patients', 'current_medications');
    await queryInterface.removeColumn('patients', 'past_surgeries');
    await queryInterface.removeColumn('patients', 'chronic_conditions');
  }
};
