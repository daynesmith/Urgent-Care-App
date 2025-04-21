require("dotenv").config(); // Load .env variables
const fs = require('fs');
const path = require('path');

// Adjust the path to remove extra "config"
const certPath = path.join(__dirname, 'certs', 'DigiCertGlobalRootCA.crt.pem');
console.log('Certificate Path:', certPath);

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, "certs", "DigiCertGlobalRootCA.crt.pem")),
        rejectUnauthorized: true
        
      }
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || "backend_db_test",
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, "certs", "DigiCertGlobalRootCA.crt.pem")),
        rejectUnauthorized: true
      }
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, "certs", "DigiCertGlobalRootCA.crt.pem")),
        rejectUnauthorized: true //Change back to true afterwards
      }
    }
  }
};
