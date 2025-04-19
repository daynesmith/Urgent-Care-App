'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Billings', 'status', {
      type: Sequelize.ENUM('unpaid', 'paid', 'past_due'),
      defaultValue: 'unpaid',
    });

    await queryInterface.addColumn('Billings', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Billings', 'paymentDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Billings', 'method', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Billings', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Billings', 'status');
    await queryInterface.removeColumn('Billings', 'dueDate');
    await queryInterface.removeColumn('Billings', 'paymentDate');
    await queryInterface.removeColumn('Billings', 'method');
    await queryInterface.removeColumn('Billings', 'notes');
  }
};
