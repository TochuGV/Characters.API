import sql from "mssql";
import config from "../utils/database.js"
import "dotenv/config";

const movieTable = process.env.DB_MOVIES_TABLE;
const characterTable = process.env.DB_CHARACTERS_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

class MovieService {

    getMovie = async (title, order) => {
        console.log("This is a function on the service");
        let response;
        if (!title){
            const pool = await sql.connect(config);
            response = await pool.request()
                .query(`SELECT ID, Image, Title, CreationDate FROM ${movieTable} ORDER BY CreationDate ${order??'ASC'}`);
        } else {
            const pool = await sql.connect(config);
            response = await pool.request()
                .input('pTitle', sql.VarChar, title ?? '')
                .query(`SELECT * FROM ${movieTable} WHERE Title = @pTitle ORDER BY CreationDate ${order??'ASC'}`);
        }
        console.log(response)
        return response.recordset;
    } 

    getMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, id)
            .query(`SELECT * FROM ${movieTable} INNER JOIN ${charactersXMoviesTable} ON ${movieTable}.ID = ${charactersXMoviesTable}.MovieID 
                    INNER JOIN ${characterTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID WHERE ${movieTable}.ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    createMovie = async (movie) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, movie?.ID ?? 0)
            .input('pImage', sql.VarChar, movie?.Image ?? '')
            .input('pTitle', sql.VarChar, movie?.Title ?? '')
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? 0)
            .input('pRating', sql.Int, movie?.Rating ?? 0)
            .query(`INSERT INTO ${movieTable}(ID, Image, Title, CreationDate, Rating) VALUES (@pID, @pImage, @pTitle, @pCreationDate, @pRating)`);
        console.log(response)
        return response.recordset;
    }

    updateMovieById = async (movie) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, movie?.ID ?? 0)
            .input('pImage', sql.VarChar, movie?.Image ?? '')
            .input('pTitle', sql.VarChar, movie?.Title ?? '')
            .input('pCreationDate', sql.Date, movie?.CreationDate ?? 0)
            .input('pRating', sql.Int, movie?.Rating ?? 0)
            .query(`UPDATE ${movieTable} SET Image = @pImage, Title = @pTitle, CreationDate = @pCreationDate, Rating = @pRating WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    deleteMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, id)
            .query(`DELETE FROM ${movieTable} WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }
}

export default new MovieService();