module.exports = (sequelize, DataTypes) => {
    const Receptionist = sequelize.define("Receptionists", {
        receptionistid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userid: {  // Foreign key from Users
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,  // Ensures a user can only be a receptionist once
            references: {
                model: "Users",
                key: "userid"
            },
            onDelete: "CASCADE"
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING(15),
            allowNull: true,
            validate: {
                is: {
                    args: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                    msg: "Phone number must be in the format XXX-XXX-XXXX"
                }
            }
        },
        hireDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        }
    }, {
        timestamps: true  // Automatically adds createdAt & updatedAt
    });


    return Receptionist;
};