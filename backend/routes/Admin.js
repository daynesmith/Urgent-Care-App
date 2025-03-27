const express = require('express')
const router = express.Router()
const { Users } = require('../models');
const {toDoctor, toAdmin, toReceptionist, toSpecialist, searchByRole} = require('../controllers/adminController')
const {validateToken} = require('../middlewares/Authmiddleware');

//will eventually have to add validate toke but for now no authentication needed
router.post("/todoctor", validateToken('admin'), toDoctor);
router.post("/toreceptionist",validateToken('admin'), toReceptionist);
router.post("/toadmin", toAdmin);
router.post("/tospecialist",validateToken('admin'), toSpecialist);

// GET /api/admin/search?role=doctor
router.get('/search', /*validateToken('admin'), */searchByRole);


module.exports = router;