module.exports = (sequelize, DataTypes) => {
    
    const Roomallocation = sequelize.define("Roomallocation",{
        roomid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        appointmentid:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Appointments',
                key: 'appointmentid'
            }
        }
    })
    
    
    return Roomallocation;
}