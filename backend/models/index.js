'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.Appointments = require('./Appointments')(sequelize, Sequelize.DataTypes);
db.Billing = require('./Billing')(sequelize, Sequelize.DataTypes);
db.Doctors = require('./Doctors')(sequelize, Sequelize.DataTypes);
db.Insurance = require('./Insurance')(sequelize, Sequelize.DataTypes);
db.Inventory = require('./Inventory')(sequelize, Sequelize.DataTypes);
db.Patients = require('./Patients')(sequelize, Sequelize.DataTypes);
db.Receptionists = require('./Receptionists')(sequelize, Sequelize.DataTypes);
db.Specialists = require('./Specialist')(sequelize, Sequelize.DataTypes); 
db.Referral = require('./Referral')(sequelize, Sequelize.DataTypes);
db.Roomallocation = require('./Roomallocation')(sequelize, Sequelize.DataTypes);
db.Shifts = require('./Shifts')(sequelize, Sequelize.DataTypes)
db.Users = require('./Users')(sequelize, Sequelize.DataTypes);
db.Visitinfo = require('./Visitinfo')(sequelize, Sequelize.DataTypes); 
db.Notifications = require('./Notifications')(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

