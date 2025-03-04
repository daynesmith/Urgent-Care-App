module.exports = (sequelize, DataTypes)=>{
    
    const Doctors = sequelize.define("Doctors",{
        doctorid: {
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
        doctortype: {
            type: DataTypes.ENUM("PK", "Oncologist", "Neurologist", "Cardiologist"),
            allowNull: false,
            defaultValue: "PK"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, // Ensures the email is required
            unique: true, // Ensures no two users can have the same email
            validate: {
                isEmail: true, // Validates the email format
                notEmpty: true, // Ensures the email is not empty
            },
        }
    })
    Doctors.associate = (models) => {
        
        Doctors.belongsTo(models.Users,{
            foreignKey: 'doctorid',
            targetKey: 'userid'
        })

        Doctors.hasMany(models.Appointments, {
          foreignKey: 'doctorid',
          as: 'appointments',       // Alias for associated appointments
        }); 
    };
    

    return Doctors;
}