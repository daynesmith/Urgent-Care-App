module.exports = (sequelize, DataTypes) => {
    const VisitinfoSupplies = sequelize.define('VisitinfoSupplies', {
      visitsuppliesid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      visitinfoid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Visitinfo', // Match the actual table name if pluralized
          key: 'visitinfoid',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  
    VisitinfoSupplies.associate = (models) => {
      VisitinfoSupplies.belongsTo(models.Visitinfo, {
        foreignKey: 'visitinfoid',
        targetKey: 'visitinfoid',
        onDelete: 'CASCADE',
      });
    };
  
    return VisitinfoSupplies;
  };