require("dotenv").config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); 
app.use(cors({
    origin: "http://localhost:5173",  // ✅ Allow frontend
    credentials: true,                // ✅ Allow cookies/auth headers
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

const db = require('./models');

//routes
const usersRouter = require('./routes/Users');
app.use('/users', usersRouter);
const adminRouter = require('./routes/Admin');
app.use('/admin', adminRouter);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("server running on port 3001");
    })
})