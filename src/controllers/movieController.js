const {createMovieModel, findAllMovieModel, findMovieByFiltersModel, updateMovieModel, deleteMovieModel} = require('../models/MovieModel');
const { createMovieSchema, updateMovieSchema } = require('../utils/validators');

/**
 * Crea una nueva película.
 */
const createMovie = async (req, res) => {
  try {
    const validatedData = createMovieSchema.parse(req.body);
    const movieId = await createMovieModel(validatedData);
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
    
    const pagination = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    }

    if (isNaN(pagination.page) || isNaN(pagination.limit)) {
      return res.status(400).json({ status: 'error', message: 'Limit y page deben ser números enteros' });
    }

    const movies = await findAllMovieModel(pagination);
    res.json({ status: 'success', data: movies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener películas', error: error.message });
  }
};

/**
 * Obtiene una película por ID.
 */
const getMovieByFilters = async (req, res) => {
  try {
    // Convertir los parámetros de la consulta en un objeto
    const filters = {
      id: req.query.id ? parseInt(req.query.id, 10) : undefined,
      titulo: req.query.titulo,
      titulo_original: req.query.titulo_original,
      director: req.query.director,
      anio: req.query.anio ? parseInt(req.query.anio, 10) : undefined,
      sinopsis: req.query.sinopsis,
      imagen_url: req.query.imagen_url,
      duracion: req.query.duracion ? parseInt(req.query.duracion, 10) : undefined,
      pais: req.query.pais,
      rating_promedio: req.query.rating_promedio ? parseFloat(req.query.rating_promedio) : undefined,
      trailer_url: req.query.trailer_url,
      fecha_estreno: req.query.fecha_estreno,
      fecha_creacion: req.query.fecha_creacion,
      fecha_modificacion: req.query.fecha_modificacion,
      usuario_id: req.query.usuario_id ? parseInt(req.query.usuario_id, 10) : undefined
    };
    
    const movieDetails = await findMovieByFiltersModel(filters);

    if (!movieDetails || movieDetails.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No se encontraron películas con los filtros proporcionados' });
    }

    res.json({ status: 'success', data: movieDetails});
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al buscar películas', error: error.message });
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

module.exports = { createMovie, getAllMovies, getMovieByFilters, updateMovie, deleteMovie };
