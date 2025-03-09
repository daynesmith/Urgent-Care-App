const express = require('express')
const router = express.Router()

const {toDoctor, toAdmin, toReceptionist} = require('../controllers/adminController')
const {validateToken} = require('../middlewares/Authmiddleware');

router.post("/todoctor", toDoctor);
router.post("/toreceptionist", toReceptionist);
router.post("/toadmin", toAdmin);

module.exports = router;