module.exports = (sequelize, DataTypes)=>{
    
    const Users = sequelize.define("Users",{
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false   
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'patient', 'doctor', 'receptionist', 'specialist'),
            allowNull: false,
            defaultValue: 'patient'
        },
    })
    Users.associate = (models) => {
        Users.hasOne(models.Doctors, {
            foreignKey: 'doctorid',
            as: 'doctorProfile'
        });
        Users.hasOne(models.Specialists, {
            foreignKey: 'user_id',
            as: 'specialistProfile'
        });
        Users.hasOne(models.Receptionists, {
            foreignKey: 'receptionistid',
            as: 'receptionistProfile'
        });
    };

    return Users;
};