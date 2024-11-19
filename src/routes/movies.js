const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', authenticateToken, movieController.createMovie);
router.put('/:id', authenticateToken, movieController.updateMovie);
router.delete('/:id', authenticateToken, movieController.deleteMovie);

module.exports = router;