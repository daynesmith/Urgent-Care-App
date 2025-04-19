'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Inventories', 'itemtype', {
      type: Sequelize.ENUM("N/A", "Material", "TypeOfAppointment", "TypeOfDoctor"),
      allowNull: true,
      defaultValue: "N/A"
    });

    await queryInterface.addColumn('Inventories', 'materialStock', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Inventories', 'materialStockMin', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Inventories', 'cost', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Inventories', 'date', {
      type: DataTypes.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('Inventories', 'doctorid', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Doctors',
        key: 'doctorid'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Inventories', 'itemtype');
    await queryInterface.removeColumn('Inventories', 'materialStock');
    await queryInterface.removeColumn('Inventories', 'materialStockMin');
    await queryInterface.removeColumn('Inventories', 'cost');
    await queryInterface.removeColumn('Inventories', 'date');
    await queryInterface.removeColumn('Inventories', 'doctorid');

    // ENUM cleanup (optional but recommended to avoid type lingering)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Inventories_itemtype";');
  }
};