'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('Specialists', 'specialty', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'department', {
        type: Sequelize.STRING(100),
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'accepting_referrals', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'bio', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'firstname', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'lastname', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'dateofbirth', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'phonenumber', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Specialists', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('Specialists', 'specialty', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'department', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'accepting_referrals', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }),
      queryInterface.changeColumn('Specialists', 'bio', {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'firstname', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'lastname', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'dateofbirth', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'phonenumber', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Specialists', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
    ]);
  }
};
