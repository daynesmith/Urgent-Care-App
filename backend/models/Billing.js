module.exports = (sequelize, DataTypes) => {
    const Billing = sequelize.define("Billings", {
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
      appointmentid: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
          model: 'Appointments',
          key: 'appointmentid',
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
      billingstatus: {
          type: DataTypes.ENUM("Pending Review", "Approved"),
          allowNull: true,
          defaultValue: "N/A"
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unpaid'
      },
      dueDate: {
        type: DataTypes.DATE
      },
      paymentDate: {
        type: DataTypes.DATE
      },
      method: {
        type: DataTypes.STRING
      }
    });
    
    return Billing;
  };