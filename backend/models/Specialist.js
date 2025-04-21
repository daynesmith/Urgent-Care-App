module.exports = (sequelize, DataTypes) => {
    const Specialists = sequelize.define("Specialists", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                model:'Users',
                key: 'userid'
            },
            allowNull: false   
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateofbirth: {
            type: DataTypes.DATE,
            allowNull: true,
            validate:{
                isDate: true
            },
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: true, 
            validate:{
                is:{
                    args: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                    msg: 'Phone number must be in the format XXX-XXX-XXXX'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, 
            unique: true, 
            validate: {
                isEmail: true, 
                notEmpty: true, 
            },
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: true,
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