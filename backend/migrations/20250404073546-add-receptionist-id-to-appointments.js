'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add new column `receptionistid` to the `Appointments` table
    await queryInterface.addColumn('Appointments', 'receptionistid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Receptionists',  // The table we are referencing
        key: 'receptionistid',   // The key in the Receptionists table
      },
      onDelete: 'SET NULL', // Optional: specifies what happens when the associated Receptionist is deleted
      onUpdate: 'CASCADE'   // Optional: specifies what happens when the associated Receptionist is updated
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the `receptionistid` column if we need to undo the migration
    await queryInterface.removeColumn('Appointments', 'receptionistid');
  }
};
