import sql from "mssql";
import config from "../utils/database.js"
import "dotenv/config";

const characterTable = process.env.DB_CHARACTERS_TABLE;
const movieTable = process.env.DB_MOVIES_TABLE;

class CharacterService {

    createCharacter = async (character) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, character?.id ?? 0)
            .input('Image', sql.VarChar, character?.image ?? '')
            .input('Name', sql.VarChar, character?.name ?? '')
            .input('Age', sql.Int, character?.age ?? 0)
            .input('Weight', sql.Int, character?.weight ?? 0)
            .input('Story', sql.VarChar, character?.story ?? '')
            .query(`INSERT INTO ${characterTable}(ID, Image, Name, Age, Weight, Story) VALUES (@pID, @pImage, @pName, @pAge, @pWeight, @pStory)`);
        console.log(response)
        return response.recordset;
    }

    updateCharacterById = async (character) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, character?.id ?? 0)
            .input('Image', sql.VarChar, character?.image ?? '')
            .input('Name', sql.VarChar, character?.name ?? '')
            .input('Age', sql.Int, character?.age ?? 0)
            .input('Weight', sql.Int, character?.weight ?? 0)
            .input('Story', sql.VarChar, character?.story ?? '')
            .query(`UPDATE ${characterTable} SET Image = @pImage, Name = @pName, Age = @pAge, Weight = @pWeight, Story = @pStory WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    deleteCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = sql.connect(config);
        const response = await pool.request()
            .input('ID', sql.Int, id)
            .query(`DELETE * FROM ${characterTable} WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }
}

export default new CharacterService();