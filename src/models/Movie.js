const db = require('../config/database');

class Movie {
  static async create(movieData) {
    const [result] = await db.query(
      'INSERT INTO peliculas (titulo, titulo_original, director, anio, sinopsis, imagen_url, duracion, pais, trailer_url, fecha_estreno, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [movieData.titulo, movieData.titulo_original, movieData.director, movieData.anio, movieData.sinopsis, movieData.imagen_url, movieData.duracion, movieData.pais, movieData.trailer_url, movieData.fecha_estreno, movieData.usuario_id]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM peliculas');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM peliculas WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, movieData) {
    const [result] = await db.query(
      'UPDATE peliculas SET titulo = ?, titulo_original = ?, director = ?, anio = ?, sinopsis = ?, imagen_url = ?, duracion = ?, pais = ?, trailer_url = ?, fecha_estreno = ? WHERE id = ?',
      [movieData.titulo, movieData.titulo_original, movieData.director, movieData.anio, movieData.sinopsis, movieData.imagen_url, movieData.duracion, movieData.pais, movieData.trailer_url, movieData.fecha_estreno, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM peliculas WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Movie;