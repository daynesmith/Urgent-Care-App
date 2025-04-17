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

    Users.associate = (models) => {
        Users.hasOne(models.Doctors, {
            foreignKey: 'doctorid',
            as: 'doctorProfile'
        });

        Users.hasOne(models.Specialists, {
            foreignKey: 'user_id',
            as: 'specialistProfile'
        });

        Users.hasOne(models.Receptionists, {
            foreignKey: 'receptionistid',
            as: 'receptionistProfile'
        });
        Users.hasMany(models.Shifts, { 
            as: 'shifts', 
            foreignKey: 'staffid'
        });
    };   

    //insert nurse role once completed
    Users.afterCreate(async (user, options) => {
        const { Doctors, Receptionists, Specialists, Patients } = sequelize.models;
        try {
            if (user.role === "doctor") {
                await Doctors.create({
                    doctorid: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    dateofbirth: user.dateofbirth,
                    phonenumber: user.phonenumber,
                    email: user.email,
                });
                console.log("Doctor row created successfully for user:", user.userid);
            } else if (user.role === "patient") {
                await Patients.create({
                    patientid: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    dateofbirth: user.dateofbirth,
                    phonenumber: user.phonenumber,
                    email: user.email,
                });
                console.log("Patient row created successfully for user:", user.userid);
            } else if (user.role === "receptionist") {
                await Receptionists.create({
                    receptionistid: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    dateofbirth: user.dateofbirth,
                    phonenumber: user.phonenumber,
                    email: user.email,
                });
                console.log("Receptionist row created successfully for user:", user.userid);
            } else if (user.role === "specialist") {
                await Specialists.create({
                    user_id: user.userid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    specialty: "General -> Insert Specialty", 
                });
                console.log("Specialist row created successfully for user:", user.userid);
            }
        } catch (error) {
            console.error(`Error creating row for role ${user.role}:`, error);
        }
    });
    
    return Users;
}
