require("dotenv").config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); 
app.use(cors(
//     {
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//     credentials: true,
// }
));


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
    app.listen(3001, () => {
        console.log("server running on port ${port}");
    })
})