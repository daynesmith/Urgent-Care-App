'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Visitinfos', 'doctornotes', {
      type: Sequelize.TEXT,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Visitinfos', 'doctornotes', {
      type: Sequelize.TEXT,
      allowNull: false, 
    });
  }
};
