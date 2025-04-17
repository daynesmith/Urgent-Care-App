module.exports = (sequelize, DataTypes) => {
    const Receptionists = sequelize.define("Receptionists", {
        receptionistid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:'Users',
                key: 'userid'
            },
            allowNull: false 
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateofbirth: {
            type: DataTypes.DATE,
            allowNull: false,
            validate:{
                isDate: true
            },
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate:{
                is:{
                    args: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                    msg: 'Phone number must be in the format XXX-XXX-XXXX'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true, 
            validate: {
                isEmail: true, 
                notEmpty: true, 
            }
        }
    
    }, {
        freezeTableName: true
    });
    
    Receptionists.associate = (models) => {
        
        Receptionists.belongsTo(models.Users,{
            foreignKey: 'receptionistid',
            targetKey: 'userid',
            as: 'user'
        })

        Receptionists.hasMany(models.Appointments, {
            foreignKey: 'receptionistid',
            as: 'appointments',       // Alias for associated appointments
          });
    };

    return Receptionists;
}