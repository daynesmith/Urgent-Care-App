module.exports = (sequelize, DataTypes) => {
    const Shifts = sequelize.define("Shifts", {
      shiftid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      staffid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'userid',
        },
      },
      cliniclocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startshift: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endshift: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      date:{
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });

    Shifts.associate = function(models) {
      Shifts.belongsTo(models.Users, {
        foreignKey: 'staffid',
        as: 'staff',
      });
    };
    
    return Shifts;
  };

  //needs room allocation for doctors and nurses, doctors also need location choosing


  //shift schedule should show: staff member, role, shift start time, shift end time, date, location

  //display role by doing a join