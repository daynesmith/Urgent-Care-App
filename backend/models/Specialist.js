module.exports = (sequelize, DataTypes) => {
    const Specialists = sequelize.define("Specialists", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
            },
        specialty: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        accepting_referrals: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
        
    });
  
    Specialists.associate = (models) => {
      Specialists.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user"
      });
    };
  
    return Specialists;
  };
  