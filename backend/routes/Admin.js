const express = require('express')
const router = express.Router()

const {toDoctor, toAdmin, toReceptionist, toSpecialist, findEmployees} = require('../controllers/adminController')
const {validateToken} = require('../middlewares/Authmiddleware');

//will eventually have to add validate toke but for now no authentication needed
router.post("/todoctor", validateToken('admin'), toDoctor);
router.post("/toreceptionist",validateToken('admin'), toReceptionist);
router.post("/toadmin", toAdmin);
router.post("/tospecialist",validateToken('admin'), toSpecialist);
router.get("/employees", findEmployees);
module.exports = router;