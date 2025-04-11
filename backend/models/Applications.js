module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define("Applications", {
        applicationid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,  // Assuming applicationid is the primary key
            autoIncrement: true,  // Auto-increment for the application ID
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateofbirth: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true, // Ensures the value is a valid date
            },
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, // Ensures phone number is in the format XXX-XXX-XXXX
                    msg: 'Phone number must be in the format XXX-XXX-XXXX',
                },
            },
        },
        stafftype: {
            type: DataTypes.ENUM("doctor", "receptionist", "admin", "specialist"),
            allowNull: false,
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
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qualifications: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certifications: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coverletter: {
            type: DataTypes.TEXT,
            allowNull: true, 
            
        },
        experience:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false,
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
            defaultValue: "pending",
          }
          

    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });

    return Application;
};

