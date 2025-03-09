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
            type: DataTypes.ENUM('admin', 'patient', 'doctor', 'receptionist'),
            allowNull: false,
            defaultValue: 'patient'
        }
    })

    return Users;
}