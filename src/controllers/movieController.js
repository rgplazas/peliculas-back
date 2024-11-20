const Movie = require('../models/Movie');
const { createMovieSchema, updateMovieSchema } = require('../utils/validators');

/**
 * Crea una nueva película.
 */
const createMovie = async (req, res) => {
  try {
    const validatedData = createMovieSchema.parse(req.body);
    const movieId = await Movie.create(validatedData);
    res.status(201).json({ id: movieId, status: 'success', message: 'Película creada con éxito' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ status: 'error', message: 'Datos de entrada no válidos', errors: error.errors });
    }
    res.status(500).json({ status: 'error', message: 'Error al crear una película', error: error.message });
  }
};

/**
 * Obtiene todas las películas con paginación.
 */
const getAllMovies = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ status: 'error', message: 'Limit y page deben ser números enteros' });
    }

    const movies = await Movie.findAll(limitNumber, offset);
    res.json({ status: 'success', data: movies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener películas', error: error.message });
  }
};

/**
 * Obtiene una película por ID.
 */
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ status: 'error', message: 'Película no encontrada' });
    }

    res.json({ status: 'success', data: movie });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener la película', error: error.message });
  }
};

/**
 * Actualiza una película.
 */
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateMovieSchema.parse(req.body);
    const result = await Movie.update(id, validatedData);

    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Película no encontrada' });
    }

    res.json({ status: 'success', message: 'Película actualizada con éxito' });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ status: 'error', message: 'Datos de entrada no válidos', errors: error.errors });
    }
    res.status(500).json({ status: 'error', message: 'Error al actualizar la película', error: error.message });
  }
};

/**
 * Elimina una película.
 */
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Movie.delete(id);

    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Película no encontrada' });
    }

    res.json({ status: 'success', message: 'Película eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar la película', error: error.message });
  }
};

module.exports = { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };
