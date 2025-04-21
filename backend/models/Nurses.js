module.exports = (sequelize, DataTypes)=>{
    const Nurses = sequelize.define("Nurses",{
        nurseid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references:{
                
                model:'Users',
                key: 'userid'
            },  
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
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
            allowNull: false, // Ensures the email is required
            unique: true, // Ensures no two users can have the same email
            validate: {
                isEmail: true, // Validates the email format
                notEmpty: true, // Ensures the email is not empty
            },
        }
    })
    Nurses.associate = (models) => {
        
        Nurses.belongsTo(models.Users,{
            foreignKey: 'nurseid',
            targetKey: 'userid'
        })
    };
    
    return Nurses;
}
