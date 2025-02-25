import { getConnection, sql } from "../database/config.js"
import "dotenv/config";

export default new class CharacterService {

    getAllCharacters = async (name, age, weight, movies, page = 1, limit = 10) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const offset = (page - 1) * limit;
        const result = await pool.request()
            .input('pName', sql.VarChar, name)
            .input('pAge', sql.Int, age !== undefined ? age : null)
            .input('pWeight', sql.Float, weight)
            .input('pMovieID', sql.UniqueIdentifier, movies)
            .input('pOffset', sql.Int, offset)
            .input('pLimit', sql.Int, limit)
            .execute('GetCharacters');
        const totalResult = await pool.request()
            .input('pName', sql.VarChar, name)
            .input('pAge', sql.Int, age !== undefined ? age : null)
            .input('pWeight', sql.Float, weight)
            .input('pMovieID', sql.UniqueIdentifier, movies)
            .execute('GetCharactersCount');
        const total = totalResult.recordset[0].Total;
        console.log(totalResult)
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
            .execute('GetCharacterByID');
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
            .execute('CreateCharacter');
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
            .execute('UpdateCharacterByID');
        console.log(result);
        return result;
    };

    deleteCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.UniqueIdentifier, id)
            .execute('DeleteCharacterByID');
        console.log(result);
        return result;
    };
};