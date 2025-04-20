'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns
    await queryInterface.changeColumn('Specialists', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userid'
      }
    });
    

    await queryInterface.addColumn('Specialists', 'dateofbirth', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Specialists', 'phonenumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Specialists', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // Modify existing column: specialty
    await queryInterface.changeColumn('Specialists', 'specialty', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert specialty to required
    await queryInterface.changeColumn('Specialists', 'specialty', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Specialists', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Remove added columns
    await queryInterface.removeColumn('Specialists', 'dateofbirth');
    await queryInterface.removeColumn('Specialists', 'phonenumber');
    await queryInterface.removeColumn('Specialists', 'email');
  }
};
