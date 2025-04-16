'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shifts', 'docotorid');

    await queryInterface.changeColumn('Shifts', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn('Shifts', 'staffid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', 
        key: 'userid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Shifts', 'cliniclocation', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Shifts', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shifts', 'docotorid', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Doctors',
        key: 'doctorid',
      },
    });

    await queryInterface.changeColumn('Shifts', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.removeColumn('Shifts', 'staffid');
    await queryInterface.removeColumn('Shifts', 'cliniclocation');
    await queryInterface.removeColumn('Shifts', 'notes');
  },
};
