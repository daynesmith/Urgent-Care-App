module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define('Notifications', {
        notificationid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        recipientid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        senderid: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('referral', 'appointment', 'general'),
            defaultValue: 'general'
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: true,    // creates createdAt and updatedAt
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        tableName: 'Notifications'  // match table name exactly
    });

    Notifications.associate = (models) => {
        Notifications.belongsTo(models.Users, {
            foreignKey: 'recipientid',
            as: 'recipient'
        });

        Notifications.belongsTo(models.Users, {
            foreignKey: 'senderid',
            as: 'sender'
        });
    };

    return Notifications;
};
