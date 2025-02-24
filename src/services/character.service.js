import { getConnection, sql } from "../database/config.js"
import { buildGetAllCharactersQuery } from "../utils/character.utils.js";
import "dotenv/config";

const characterTable = process.env.DB_CHARACTER_TABLE;
const movieTable = process.env.DB_MOVIE_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

export default new class CharacterService {

    getAllCharacters = async (name, age, weight, movies, page = 1, limit = 10) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const offset = (page - 1) * limit;
        const query = `SELECT c.ID, c.Image, c.Name FROM ${characterTable} c WHERE
                        (@pName IS NULL OR c.Name LIKE '%' + @pName + '%') AND
                        (@pAge IS NULL OR c.Age = @pAge) AND
                        (@pWeight IS NULL OR c.Weight = @pWeight) AND
                        (@pMovieID IS NULL OR EXISTS (
                        SELECT 1 FROM ${charactersXMoviesTable} cxm WHERE cxm.CharacterID = c.ID AND cxm.MovieID = @pMovieID))
                        ORDER BY c.ID OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY;`
        const result = await pool.request()
            .input('pName', sql.VarChar, name)
            .input('pAge', sql.Int, age !== undefined ? age : null)
            .input('pWeight', sql.Float, weight)
            .input('pMovieID', sql.UniqueIdentifier, movies)
            .input('pOffset', sql.Int, offset)
            .input('pLimit', sql.Int, limit)
            .query(query);
        
        const countQuery = `SELECT COUNT(*) AS Total FROM ${characterTable} c
                            LEFT JOIN ${charactersXMoviesTable} cxm ON c.ID = cxm.CharacterID WHERE
                            (@pName IS NULL OR c.Name LIKE '%' + @pName + '%') AND
                            (@pAge IS NULL OR c.Age = @pAge) AND
                            (@pWeight IS NULL OR c.Weight = @pWeight) AND
                            (@pMovieID IS NULL OR cxm.MovieID = @pMovieID);`;
        const totalResult = await pool.request()
            .input('pName', sql.VarChar, name)
            .input('pAge', sql.Int, age !== undefined ? age : null)
            .input('pWeight', sql.Float, weight)
            .input('pMovieID', sql.UniqueIdentifier, movies)
            .query(countQuery);
        const total = totalResult.recordset[0].Total;
        console.log(result);
        return {
            characters: result.recordset,
            total: total,
            currentPage: page,
            totalPages: Math.ceil(total/limit)
        };
    };

    getCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .query(`SELECT * FROM ${characterTable} LEFT JOIN ${charactersXMoviesTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID
            LEFT JOIN ${movieTable} ON ${movieTable}.ID = ${charactersXMoviesTable}.MovieID WHERE ${characterTable}.ID = @pID`);
        console.log(result);
        return result.recordset.length > 0 ? result.recordset : null;
    };

    createCharacter = async (character) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pImage', sql.VarChar, character?.Image ?? '')
            .input('pName', sql.VarChar, character?.Name ?? '')
            .input('pAge', sql.Int, character?.Age ?? 0) //Mayor o igual a 0
            .input('pWeight', sql.Float, character?.Weight ?? 0.001) //Mayor a 0
            .input('pStory', sql.VarChar, character?.Story ?? '')
            .query(`INSERT INTO ${characterTable}(Image, Name, Age, Weight, Story) VALUES (@pImage, @pName, @pAge, @pWeight, @pStory)`);
        console.log(result);
        return result;
    };

    updateCharacterById = async (id, character) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .input('pImage', sql.VarChar, character?.Image ?? null) //No puede ser NULL 
            .input('pName', sql.VarChar, character?.Name ?? null) //No puede ser NULL
            .input('pAge', sql.Int, character?.Age ?? null)
            .input('pWeight', sql.Int, character?.Weight ?? null)
            .input('pStory', sql.VarChar, character?.Story ?? null)
            .query(`UPDATE ${characterTable} SET Image = @pImage, Name = @pName, Age = @pAge, Weight = @pWeight, Story = @pStory WHERE ID = @pID`);
        console.log(result);
        return result;
    };

    deleteCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .query(`DELETE FROM ${characterTable} WHERE ID = @pID`);
        console.log(result);
        return result;
    };
};