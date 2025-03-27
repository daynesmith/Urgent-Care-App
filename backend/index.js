require("dotenv").config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); 
app.use(cors());

const db = require('./models');

//routes
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const adminRouter = require('./routes/Admin');
app.use('/admin', adminRouter);
const patientRouter = require('./routes/Patients');
app.use('/patient', patientRouter);
const doctorRouter = require('./routes/Doctors');
app.use('/doctor', doctorRouter);
const receptionistRouter = require('./routes/Receptionists');
app.use('/receptionist', receptionistRouter);
const appointmentsRouter = require('./routes/Appointments');
app.use('/appointments', appointmentsRouter);



db.sequelize.sync().then(() => {
    const port = process.env.PORT || 3001; // listen on port in env or 3001
    app.listen(port, () => {
        console.log("server running on port 3001");
    })
})