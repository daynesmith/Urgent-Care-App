module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define("Inventory", {
      inventoryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      itemname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemtype: {
        type: DataTypes.ENUM("N/A", "Material", "TypeOfAppointment", "TypeOfDoctor"),
        allowNull: true,
        defaultValue: "N/A"
      },
      materialStock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      materialStockMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull : true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      doctorid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'Doctors',
            key: 'doctorid'
        }
    }
    });

    Inventory.associate = (models) => {
      Inventory.belongsTo(models.Doctors,{
          foreignKey: 'doctorid',
          as: 'doctor'
    })}

    return Inventory;
  };