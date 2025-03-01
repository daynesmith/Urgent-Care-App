module.exports = (sequelize, DataTypes)=>{                      //Appointments table keeps track of an appointment requested by a patient.
    
    const Appointments = sequelize.define("Appointments",{
        appointmentid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false   
        },
        patientid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'Patients',
                key: 'patientid'
            }
        },
        doctorid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'Doctors',
                key: 'doctorid'
            }
        },
        requesteddate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        requestedtime:{
            type: DataTypes.TIME,
            allowNull: false
        },
        appointmentstatus: {
            type: DataTypes.ENUM('requested', 'scheduled', 'completed','cancelled'),
            allowNull: false,
            defaultValue: 'requested'
        },
        recommendedspecialist: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Specialists',
                key: 'specialistid'
            }
        }
    })

        Appointments.associate = (models) => {
        Appointments.belongsTo(models.Patients,{
            foreignKey: 'patientid',
            as: 'patient'
        })
        
        Appointments.belongsTo(models.Specialists,{
            foreignKey: 'specialistid',
            as: 'specialist'
        })

        Appointments.belongsTo(models.Doctors,{
            foreignKey: 'doctorid',
            as: 'doctor'
        })
    }
    
    Appointments.afterUpdate(async (appointment, options)=>{
        if(appointment.changed('appointmentstatus') && appointment.appointmentstatus === 'completed'){
            try{
                await sequelize.models.Billing.create({
                    patientid: appointment.patientid,
                    amount: 100,
                })
                console.log('billiing entry created successfully for patient:', appointment.patientid)
            }catch(error){
                console.error('error createing billing entry:', error)
            }
        }
    })

    return Appointments;
}