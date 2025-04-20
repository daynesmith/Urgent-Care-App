'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Visitinfo', 'doctornotes', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Visitinfo', 'doctornotes', {
      type: Sequelize.TEXT,
      allowNull: false, 
    });
  }
};
