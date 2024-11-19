const Movie = require('../models/Movie');

exports.createMovie = async (req, res) => {
  try {
    const movieId = await Movie.create(req.body);
    res.status(201).json({ id: movieId, message: 'Movie created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const result = await Movie.update(req.params.id, req.body);
    if (result) {
      res.json({ message: 'Movie updated successfully' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const result = await Movie.delete(req.params.id);
    if (result) {
      res.json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};