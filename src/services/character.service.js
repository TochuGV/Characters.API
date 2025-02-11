import {getConnection, sql} from "../database/config.js"
import "dotenv/config";

const characterTable = process.env.DB_CHARACTER_TABLE;

export default new class CharacterService {

    getAllCharacters = async () => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .query(`SELECT * FROM ${characterTable}`);
        console.log(result);
        return result.recordset;
    }

    getCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id)
            .query(`SELECT * FROM ${characterTable} WHERE ID = @pID`);
        console.log(result);
        return result.recordset;
    }

    createCharacter = async (character) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pImage', sql.VarChar, character?.Image ?? '')
            .input('pName', sql.VarChar, character?.Name ?? '')
            .input('pAge', sql.Int, character?.Age ?? 0)
            .input('pWeight', sql.Float, character?.Weight ?? 0)
            .input('pStory', sql.VarChar, character?.Story ?? '')
            .query(`INSERT INTO ${characterTable}(Image, Name, Age, Weight, Story) VALUES (@pImage, @pName, @pAge, @pWeight, @pStory)`);
        console.log(result);
        return result.recordset;
    }

    updateCharacterById = async (id, character) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id ?? 0)
            .input('pImage', sql.VarChar, character?.Image ?? '')
            .input('pName', sql.VarChar, character?.Name ?? '')
            .input('pAge', sql.Int, character?.Age ?? 0)
            .input('pWeight', sql.Int, character?.Weight ?? 0)
            .input('pStory', sql.VarChar, character?.Story ?? '')
            .query(`UPDATE ${characterTable} SET Image = @pImage, Name = @pName, Age = @pAge, Weight = @pWeight, Story = @pStory WHERE ID = @pID`);
        console.log(result);
        return result.recordset;
    }

    deleteCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pID', sql.Int, id)
            .query(`DELETE FROM ${characterTable} WHERE ID = @pID`);
        console.log(result);
        return result.recordset;
    };
};