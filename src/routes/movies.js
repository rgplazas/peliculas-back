const express = require('express');
const router = express.Router();
const { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', authenticateToken, createMovie);
router.put('/:id', authenticateToken, updateMovie);
router.delete('/:id', authenticateToken, deleteMovie);

module.exports = router;
