module.exports = (sequelize, DataTypes) => {
    const Shifts = sequelize.define("Shifts", {
      shiftid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      /*cliniclocationid{
        this will hold where the clinic is so that a doctor cant be scheduled at multiple locations on a given day
      } */
      docotorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Doctors',
            key:'doctorid'
        }
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
        type: DataTypes.DATE,
        allowNull: false
      }
    });
    
    return Shifts;
  };