// Will serve all pages and http requests
const express = require('express');
const router = express.Router();

router.use('/', express.static(__dirname + '/pages/index/'));

module.exports = router;