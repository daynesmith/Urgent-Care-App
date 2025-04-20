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
const inventoryRouter = require('./routes/Inventory');
app.use('/inventory', inventoryRouter);
const reportsRoute = require('./routes/Reports');
app.use('/api/reports', reportsRoute);


const referralRoutes = require('./routes/Referral');
app.use('/referrals', referralRoutes);

const visitinfoRouter = require('./routes/VisitInfo');
app.use("/visitinfo", visitinfoRouter);
const specialistRouter = require('./routes/Specialist');
app.use("/specialists", specialistRouter)
const nurseRouter = require('./routes/Nurses');
app.use("/nurses", nurseRouter);

app.use('/api/stripe', require('./routes/stripe'));


db.sequelize.sync()
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync DB or start server:", err);
  });


