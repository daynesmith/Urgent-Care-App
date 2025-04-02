module.exports = (sequelize, DataTypes)=>{
    
    const Patients = sequelize.define("Patients",{
        patientid: {
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
            },
        },
        chronic_conditions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        past_surgeries: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        current_medications:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        allergies: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lifestyle_factors: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        vaccination_status: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    })
    Patients.associate = (models) => {
        
        Patients.belongsTo(models.Users,{
            foreignKey: 'patientid',
            targetKey: 'userid'
        })

        Patients.hasMany(models.Appointments, {
          foreignKey: 'patientid',
          as: 'appointments',       
        }); 
    };
    

    return Patients;
}