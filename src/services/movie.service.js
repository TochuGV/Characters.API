import { getConnection, sql } from "../database/config.js"
import { buildGetAllMoviesQuery, getCurrentCreationDate } from "../utils/movie.utils.js";
import "dotenv/config";

const characterTable = process.env.DB_CHARACTER_TABLE;
const movieTable = process.env.DB_MOVIE_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

export default new class MovieService {

    getAllMovies = async (title, order, page = 1, limit = 10) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const offset = (page - 1) * limit;
        const query = `SELECT ID, Image, Title, CreationDate
                        ${title ? ', Rating' : ''}
                        FROM ${movieTable}
                        WHERE (@pTitle IS NULL OR Title LIKE '%' + @pTitle + '%')
                        ORDER BY CreationDate ${order??'ASC'} 
                        OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY;`
        const result = await pool.request()
            .input('pTitle', sql.VarChar, title)
            .input('pOffset', sql.Int, offset)
            .input('pLimit', sql.Int, limit)
            .query(query);
        const countQuery = `SELECT COUNT(*) AS Total FROM ${movieTable} WHERE (@pTitle IS NULL OR Title LIKE '%' + @pTitle + '%');`;
        const totalResult = await pool.request()
            .input('pTitle', sql.VarChar, title)
            .query(countQuery);
        const total = totalResult.recordset[0].Total;
        console.log(result);
        return {
            movies: result.recordset,
            total: total,
            currentPage: page,
            totalPages: Math.ceil(total/limit)
        };
    };

    getMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .query(`SELECT * FROM ${movieTable} LEFT JOIN ${charactersXMoviesTable} ON ${movieTable}.ID = ${charactersXMoviesTable}.MovieID 
                    LEFT JOIN ${characterTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID WHERE ${movieTable}.ID = @pID`);
        console.log(result);
        return result.recordset.length > 0 ? result.recordset : null;
    };

    createMovie = async (movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pImage', sql.VarChar, movie?.Image ?? '')
            .input('pTitle', sql.VarChar, movie?.Title ?? '')
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? getCurrentCreationDate()) //Tendría que mostrar solo YYYY-MM-DD pero muestra el tiempo también
            .input('pRating', sql.Int, movie?.Rating ?? 0) //Tiene que estar entre 1 y 5
            .query(`INSERT INTO ${movieTable}(Image, Title, CreationDate, Rating) VALUES (@pImage, @pTitle, @pCreationDate, @pRating)`);
        console.log(result);
        return result;
    };

    updateMovieById = async (id, movie) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .input('pImage', sql.VarChar, movie?.Image ?? null) //No puede ser NULL 
            .input('pTitle', sql.VarChar, movie?.Title ?? null) //No puede ser NULL 
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? getCurrentCreationDate()) //Tendría que mostrar solo YYYY-MM-DD pero muestra el tiempo también
            .input('pRating', sql.Int, movie?.Rating ?? null) //Tiene que estar entre 1 y 5
            .query(`UPDATE ${movieTable} SET Image = @pImage, Title = @pTitle, CreationDate = @pCreationDate, Rating = @pRating WHERE ID = @pID`);
        console.log(result);
        return result;
    };

    deleteMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .query(`DELETE FROM ${movieTable} WHERE ID = @pID`);
        console.log(result);
        return result;
    };
};