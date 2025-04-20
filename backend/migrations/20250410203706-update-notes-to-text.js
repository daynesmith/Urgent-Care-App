'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Visitinfo', 'doctornotes', {
        type: Sequelize.TEXT,
        allowNull: false,
    });

    await queryInterface.changeColumn('Visitinfo', 'notesforpatient', {
        type: Sequelize.TEXT,
        allowNull: false,
    });
},
down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Visitinfo', 'doctornotes', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    await queryInterface.changeColumn('Visitinfo', 'notesforpatient', {
        type: Sequelize.STRING, 
        allowNull: false,
      });
  },
};