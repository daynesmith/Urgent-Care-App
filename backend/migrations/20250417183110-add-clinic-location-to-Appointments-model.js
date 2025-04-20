'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointments', 'cliniclocation', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Appointments', 'cliniclocation');
  },
};