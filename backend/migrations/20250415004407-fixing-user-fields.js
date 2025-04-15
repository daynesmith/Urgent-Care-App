'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'experience', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'zip', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^\d{5}(-\d{4})?$/, // Validates ZIP code format XXXXX or XXXXX-XXXX
      },
    });

    await queryInterface.changeColumn('Users', 'phonenumber', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, // Validates phone number format XXX-XXX-XXXX
      },
    });

    await queryInterface.changeColumn('Users', 'status', {
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
      allowNull: true,
      defaultValue: 'pending',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'experience', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'zip', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'phonenumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};