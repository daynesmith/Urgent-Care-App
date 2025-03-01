module.exports = (sequelize, DataTypes)=>{
    
    const Users = sequelize.define("Users",{
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false   
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin','patient', 'doctor','receptionist'),
            allowNull: false,
            defaultValue: 'patient'
        }
    })

    return Users;
}