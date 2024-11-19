const express = require('express');
const router = express.Router();
const themoviedbController = require('../controllers/themoviedbController');

router.get('/movie/:id', themoviedbController.themoviedbDetails);

module.exports = router;