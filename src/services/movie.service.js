import { getConnection, sql } from "../database/config.js"
import { buildGetAllMoviesQuery } from "../utils/movie.utils.js";
import "dotenv/config";

const characterTable = process.env.DB_CHARACTER_TABLE;
const movieTable = process.env.DB_MOVIE_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

export default new class MovieService {

    getAllMovies = async (title, order) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const query = buildGetAllMoviesQuery(title, order); 
        const result = await pool.request()
            .input('pTitle', sql.VarChar, title ?? '')
            .query(query);
        console.log(result);
        return result.recordset;
    };

    getMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id)
            .query(`SELECT * FROM ${movieTable} LEFT JOIN ${charactersXMoviesTable} ON ${movieTable}.ID = ${charactersXMoviesTable}.MovieID 
                    LEFT JOIN ${characterTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID WHERE ${movieTable}.ID = @pID`);
        console.log(result);
        return result.recordset;
    };

    createMovie = async (movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pImage', sql.VarChar, movie?.Image ?? '')
            .input('pTitle', sql.VarChar, movie?.Title ?? '')
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? 0)
            .input('pRating', sql.Int, movie?.Rating ?? 0)
            .query(`INSERT INTO ${movieTable}(Image, Title, CreationDate, Rating) VALUES (@pImage, @pTitle, @pCreationDate, @pRating)`);
        console.log(result);
        return result.recordset;
    };

    updateMovieById = async (id, movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id ?? 0)
            .input('pImage', sql.VarChar, movie?.Image ?? '')
            .input('pTitle', sql.VarChar, movie?.Title ?? '')
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? 0)
            .input('pRating', sql.Int, movie?.Rating ?? 0)
            .query(`UPDATE ${movieTable} SET Image = @pImage, Title = @pTitle, CreationDate = @pCreationDate, Rating = @pRating WHERE ID = @pID`);
        console.log(result);
        return result.recordset;
    };

    deleteMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id)
            .query(`DELETE FROM ${movieTable} WHERE ID = @pID`);
        console.log(result);
        return result.recordset;
    };
};