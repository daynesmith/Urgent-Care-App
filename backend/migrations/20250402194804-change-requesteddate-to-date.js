'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add altering commands here
    return queryInterface.changeColumn('Appointments', 'requesteddate', {
      type: Sequelize.DATEONLY,  
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Add reverting commands here
    return queryInterface.changeColumn('Appointments', 'requesteddate', {
      type: Sequelize.DATE,  
      allowNull: false
    });
  }
};
