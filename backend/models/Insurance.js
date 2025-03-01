module.exports = (sequelize, DataTypes)=>{
    
    const Insurance = sequelize.define("insurance",{
        patientid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:'Patients',
                key: 'patientid'
            },
            allowNull: false   
        },
        providername: {
            type: DataTypes.STRING,
            allowNull: false
        },
        policynumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        groupnumber: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    
    Insurance.associate = (models) => {
        
        Insurance.belongsTo(models.Patients,{
            foreignKey: 'patientid',  // Insurance.patientid
            targetKey: 'patientid'   // Patients.patientid
        })
    };

    return Insurance;
}