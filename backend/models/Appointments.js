module.exports = (sequelize, DataTypes) => {      
    
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
        appointmenttype:{
            type: DataTypes.STRING,
            allowNull: true
        }, 
        requesteddate:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        requestedtime:{
            type: DataTypes.TIME,
            allowNull: false
        },
        appointmentstatus: {
            type: DataTypes.ENUM( 'scheduled','waiting', 'in progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'scheduled'
        },
        recommendedspecialist: {
            type: DataTypes.ENUM("Oncologist", "Cardiologist", "Neurologist"),
            allowNull: true,
        },
        
        receptionistid: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references:{
                model: 'Receptionists',
                key: 'receptionistid'
            }
        },

        cliniclocation: {
            type: DataTypes.STRING,
            allowNull: true
        },

        isLate: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        specialistid: {
            type: DataTypes.INTEGER,
            allowNull: true, // allowNull = true so only one of doctor or specialist is required
            references: {
              model: 'Specialists',
              key: 'user_id' // or your equivalent key
            }
        },
    })

        Appointments.associate = (models) => {
        Appointments.belongsTo(models.Patients,{
            foreignKey: 'patientid',
            as: 'patient'
        })

        Appointments.belongsTo(models.Doctors,{
            foreignKey: 'doctorid',
            as: 'doctor'
        })

        Appointments.belongsTo(models.Receptionists,{
            foreignKey: 'receptionistid',
            as: 'receptionist'
        })

        Appointments.belongsTo(models.Specialists, {
            foreignKey: 'specialistid',
            as: 'specialist'
          });
    }
    
    Appointments.afterUpdate(async (appointment, options)=>{
        if(appointment.changed('appointmentstatus') && appointment.appointmentstatus === 'completed'){
            try{
                await sequelize.models.Billing.create({
                    appointmentid: appointment.appointmentid,
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