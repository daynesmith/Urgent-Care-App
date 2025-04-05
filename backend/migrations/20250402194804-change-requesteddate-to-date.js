'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Appointments', 'requesteddate', {
      type: Sequelize.DATEONLY,  
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Appointments', 'requesteddate', {
      type: Sequelize.DATE,   //revert to DATETIME if need to rollback
      allowNull: false
    });
  }
};
