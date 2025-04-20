'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Visitinfos', 'chief_complaint', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'symptoms', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'diagnosis', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'treatment_plan', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'additional_notes', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'follow_up', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Vital Signs fields
    await queryInterface.addColumn('Visitinfos', 'temperature', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'blood_pressure', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'heart_rate', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'respiratory_rate', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'oxygen_saturation', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Visitinfos', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Visitinfos', 'chief_complaint');
    await queryInterface.removeColumn('Visitinfos', 'symptoms');
    await queryInterface.removeColumn('Visitinfos', 'diagnosis');
    await queryInterface.removeColumn('Visitinfos', 'treatment_plan');
    await queryInterface.removeColumn('Visitinfos', 'additional_notes');
    await queryInterface.removeColumn('Visitinfos', 'follow_up');
    await queryInterface.removeColumn('Visitinfos', 'temperature');
    await queryInterface.removeColumn('Visitinfos', 'blood_pressure');
    await queryInterface.removeColumn('Visitinfos', 'heart_rate');
    await queryInterface.removeColumn('Visitinfos', 'respiratory_rate');
    await queryInterface.removeColumn('Visitinfos', 'oxygen_saturation');
    await queryInterface.removeColumn('Visitinfos', 'weight');
    await queryInterface.removeColumn('Visitinfos', 'height');
  }
};
