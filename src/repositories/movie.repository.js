import { getConnection, sql } from "../database/config.js"

export default class MovieRepository {
  async getAll(title, order, offset, limit){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pTitle', sql.VarChar, title)
      .input('pOrder', sql.VarChar, order)
      .input('pOffset', sql.Int, offset)
      .input('pLimit', sql.Int, limit)
      .execute('GetMovies');
    const totalResult = await pool.request()
      .input('pTitle', sql.VarChar, title)
      .execute('GetMoviesCount');
    return {
      items: result.recordset,
      total: totalResult.recordset[0].Total,
    };
  };

  async getById(id){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .execute('GetMovieById');
    return result.recordset[0];
  };

  async create(movie){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pImage', sql.VarChar, movie.Image)
      .input('pTitle', sql.VarChar, movie.Title)
      .input('pCreationDate', sql.Date, movie.CreationDate)
      .input('pRating', sql.Int, movie.Rating)
      .execute('CreateMovie');
    return result.recordset?.[0]?.RowsAffected > 0;
  };

  async updateById(id, movie){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .input('pImage', sql.VarChar, movie.Image)
      .input('pTitle', sql.VarChar, movie.Title)
      .input('pCreationDate', sql.Date, movie.CreationDate)
      .input('pRating', sql.Int, movie.Rating)
      .execute('UpdateMovieById');
    return result.recordset?.[0]?.RowsAffected > 0;
  };

  async deleteById(id){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .execute('DeleteMovieById');
    return result.recordset?.[0]?.RowsAffected > 0;
  };
};