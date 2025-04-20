'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Visitinfo', 'chief_complaint', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'symptoms', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'diagnosis', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'treatment_plan', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'additional_notes', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'follow_up', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Vital Signs fields
    await queryInterface.addColumn('Visitinfo', 'temperature', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'blood_pressure', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'heart_rate', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'respiratory_rate', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'oxygen_saturation', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfo', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Visitinfo', 'chief_complaint');
    await queryInterface.removeColumn('Visitinfo', 'symptoms');
    await queryInterface.removeColumn('Visitinfo', 'diagnosis');
    await queryInterface.removeColumn('Visitinfo', 'treatment_plan');
    await queryInterface.removeColumn('Visitinfo', 'additional_notes');
    await queryInterface.removeColumn('Visitinfo', 'follow_up');
    await queryInterface.removeColumn('Visitinfo', 'temperature');
    await queryInterface.removeColumn('Visitinfo', 'blood_pressure');
    await queryInterface.removeColumn('Visitinfo', 'heart_rate');
    await queryInterface.removeColumn('Visitinfo', 'respiratory_rate');
    await queryInterface.removeColumn('Visitinfo', 'oxygen_saturation');
    await queryInterface.removeColumn('Visitinfo', 'weight');
    await queryInterface.removeColumn('Visitinfo', 'height');
  }
};
