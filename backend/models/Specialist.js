module.exports = (sequelize, DataTypes) => {
    const Specialists = sequelize.define("Specialists", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true,
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
        foreignKey: "userid",
        targetKey: "userid"
      });
    };
  
    return Specialists;
  };
  