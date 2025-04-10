module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define("Referral", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specialist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "denied"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    /*implement later, once visit info is changed
    visitinfo_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // or false, depending if every referral *must* have one
    }
    */
    
  }, {
    tableName: "Referrals", 
    timestamps: false       
  });

  Referral.associate = (models) => {
    Referral.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      as: "patient" 
    });
    Referral.belongsTo(models.Doctors, {
      foreignKey: "doctor_id", 
      as: "doctor" 
    });
    Referral.belongsTo(models.Specialists, {
      foreignKey: "specialist_id",
      targetKey: "user_id",
      as: "specialist"
    });
    /* Uncomment this after changing VisitInfos
    Referral.belongsTo(models.VisitInfos, {
      foreignKey: "visitinfo_id",
      as: "visitInfo"
    });
    */
  };

  return Referral;
};
