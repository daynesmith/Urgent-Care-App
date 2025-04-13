'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'firstname', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'lastname', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'dateofbirth', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'phonenumber', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'qualifications', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'certifications', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'coverletter', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'experience', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'street', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'city', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'state', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'zip', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
      allowNull: true,
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'firstname');
    await queryInterface.removeColumn('Users', 'lastname');
    await queryInterface.removeColumn('Users', 'dateofbirth');
    await queryInterface.removeColumn('Users', 'phonenumber');
    await queryInterface.removeColumn('Users', 'qualifications');
    await queryInterface.removeColumn('Users', 'certifications');
    await queryInterface.removeColumn('Users', 'coverletter');
    await queryInterface.removeColumn('Users', 'experience');
    await queryInterface.removeColumn('Users', 'street');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'state');
    await queryInterface.removeColumn('Users', 'zip');
    await queryInterface.removeColumn('Users', 'status');
  }
};
