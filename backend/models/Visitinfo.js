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
        // Optional text fields
        doctornotes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        notesforpatient: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
  
        // Vital Signs
        temperature: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        blood_pressure: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        heart_rate: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        respiratory_rate: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        oxygen_saturation: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        weight: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        height: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
      },
      {
        tableName: 'Visitinfo',         // Ensure correct table
        freezeTableName: true,          // Disable automatic pluralization
        underscored: true,              // If your DB uses snake_case
        timestamps: true,
      }
    );
  
    Visitinfo.associate = (models) => {
      // Link back to the Appointments model
      Visitinfo.belongsTo(models.Appointments, {
        foreignKey: 'appointmentid',
        targetKey: 'appointmentid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  
    return Visitinfo;
  };
  