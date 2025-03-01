module.exports = (sequelize, DataTypes)=>{
    
    const Visitinfo = sequelize.define("Visitinfo",{
        visitinfoid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:'Appointments',
                key: 'appointmentid'
            },
            allowNull: false    
        },
        doctornotes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        notesforpatient: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    Visitinfo.associate = (models) => {

        Visitinfo.belongsTo(models.Appointments,{
            foreignKey: 'visitinfoid',
            targetKey: 'appointmentid'
        })
        
    }
    

    return Visitinfo;
}