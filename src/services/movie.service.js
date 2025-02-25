import { getConnection, sql } from "../database/config.js"
import { getCurrentCreationDate } from "../utils/movie.utils.js";
import "dotenv/config";

export default new class MovieService {

    getAllMovies = async (title, order, page = 1, limit = 10) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const offset = (page - 1) * limit;
        const result = await pool.request()
            .input('pTitle', sql.VarChar, title)
            .input('pOrder', sql.VarChar, order)
            .input('pOffset', sql.Int, offset)
            .input('pLimit', sql.Int, limit)
            .execute('GetMovies');
        const totalResult = await pool.request()
            .input('pTitle', sql.VarChar, title)
            .execute('GetMoviesCount');
        const total = totalResult.recordset[0].Total;
        console.log(result);
        console.log(totalResult)
        return {
            movies: result.recordset,
            total: total,
            currentPage: Number(page),
            totalPages: Math.ceil(total/limit)
        };
    };

    getMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .execute('GetMovieByID');
        console.log(result);
        return result.recordset.length > 0 ? result.recordset : null;
    };

    createMovie = async (movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pImage', sql.VarChar, movie?.Image)
            .input('pTitle', sql.VarChar, movie?.Title)
            .input('pCreationDate', sql.Date, movie?.CreationDate)
            .input('pRating', sql.Int, movie?.Rating)
            .execute('CreateMovie');
        console.log(result);
        return result.rowsAffected[0] > 0;
    };

    updateMovieById = async (id, movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .input('pImage', sql.VarChar, movie?.Image)
            .input('pTitle', sql.VarChar, movie?.Title)
            .input('pCreationDate', sql.Date, movie?.CreationDate)
            .input('pRating', sql.Int, movie?.Rating)
            .execute('UpdateMovieByID');
        console.log(result);
        return result.rowsAffected[0] > 0;
    };

    deleteMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .execute('DeleteMovieByID');
        console.log(result);
        return result.rowsAffected[0] > 0;
    };
};