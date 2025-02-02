const router = require('express').Router();

const { changeViolation } = require('../controller/plateNumber');


router.put('/admin/report/violations/:id', changeViolation);

module.exports = router;