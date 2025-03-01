module.exports = (sequelize, DataTypes) => {
    const Billing = sequelize.define("Billing", {
      billingid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patientid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'patientid',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2), // Example field for amount
        allowNull: false,
        defaultValue: 100
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Billing;
  };