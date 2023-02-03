import sql from "mssql";
import config from "../utils/database.js"
import "dotenv/config";

const movieTable = process.env.DB_MOVIES_TABLE;
const characterTable = process.env.DB_CHARACTERS_TABLE;

class MovieService {

    createMovie = async (movie) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, movie?.id ?? 0)
            .input('Image', sql.VarChar, movie?.image ?? '')
            .input('Title', sql.VarChar, movie?.title ?? '')
            .input('CreationDate', sql.Date, movie?.creationDate ?? 0)
            .input('Qualification', sql.Int, movie?.rating ?? 0)
            .query(`INSERT INTO ${movieTable}(ID, Image, Title, CreationDate, Qualification) VALUES (@pID, @pImage, @pTitle, @pCreationDate, @pQualification)`);
        console.log(response)
        return response.recordset;
    }

    updateMovieById = async (movie) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, movie?.id ?? 0)
            .input('Image', sql.VarChar, movie?.image ?? '')
            .input('Title', sql.VarChar, movie?.title ?? '')
            .input('CreationDate', sql.Date, movie?.creationDate ?? 0)
            .input('Qualification', sql.Int, movie?.rating ?? 0)
            .query(`UPDATE ${movieTable} SET Image = @pImage, Title = @pTitle, CreationDate = @pCreationDate, Qualification = @pQualification WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    deleteMovieById = async (id) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, id)
            .query(`DELETE * FROM ${movieTable} WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }
}

export default new MovieService();