'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Add a new auto-incrementing primary key column
      await queryInterface.addColumn(
        'Visitinfo',
        'visitid',
        {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        { transaction }
      );

      // 3. Re-add visitid as PRIMARY KEY only (already marked above in addColumn)
      // Sequelize does this automatically; no need for addConstraint for PK here

      // 4. Keep visitinfoid as a regular foreign key
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};

