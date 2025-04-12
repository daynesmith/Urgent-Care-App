module.exports = (sequelize, DataTypes)=>{
    
    const Users = sequelize.define("Users",{
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            validate: {
                isDate: true, // Ensures the value is a valid date
            },
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, // Ensures phone number is in the format XXX-XXX-XXXX
                    msg: 'Phone number must be in the format XXX-XXX-XXXX',
                },
            },
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures no duplicate email addresses
            validate: {
                isEmail: true, // Validates email format
                notEmpty: true, // Ensures email is not empty
            },
        },
        role: {
            type: DataTypes.ENUM('admin', 'patient', 'doctor', 'receptionist', 'specialist'),
            allowNull: false,
            defaultValue: 'patient'
        },
        qualifications: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        certifications: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coverletter: {
            type: DataTypes.TEXT,
            allowNull: true, 
            
        },
        experience:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                // Validates that the zip code is in the format XXXXX or XXXXX-XXXX
                is: {
                    args: /^\d{5}(-\d{4})?$/, 
                    msg: 'Zip code must be in the format XXXXX or XXXXX-XXXX',
                },
            },
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "rejected"),
            allowNull: true,
            defaultValue: "pending",
          }
    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });

    return Users;
}
