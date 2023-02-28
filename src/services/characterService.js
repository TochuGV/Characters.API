import sql from "mssql";
import config from "../utils/database.js"
import "dotenv/config";

const characterTable = process.env.DB_CHARACTERS_TABLE;
const movieTable = process.env.DB_MOVIES_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

class CharacterService {

    getCharacter = async (name, age, weight, movies) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        let query = `SELECT ID, Image, Name from ${characterTable}`;

        if(movies != null){
            query = query + ` INNER JOIN ${charactersXMoviesTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID WHERE ${charactersXMoviesTable}.MovieID = @pID `
        }

        if (name != null){
            if (movies != null){
                query = query + " AND Name = @pName";
            } else { 
                query = query + " WHERE Name = @pName";
            }
        }

        if (age != null){
            if (movies != null || name != null){
                query = query + " AND Age = @pAge";
            } else {
                query = query + " WHERE Age = @pAge";
            }
        }

        if (weight != null){
            if (movies != null | name != null || age != null){
                query = query + " AND Weight = @pWeight";
            } else {
                query = query + " WHERE Weight = @pWeight";
            }
        }

        const response = await pool.request()
            .input('pName', sql.VarChar, name)
            .input('pAge', sql.Int, age)
            .input('pWeight', sql.Int, weight)
            .input('pID', sql.Int, movies)
            .query(query)
        console.log(response) 
        return response.recordset;
    }

    getCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, id)
            .query(`SELECT * FROM ${characterTable} INNER JOIN ${charactersXMoviesTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID
            INNER JOIN ${movieTable} ON ${movieTable}.ID = ${charactersXMoviesTable}.MovieID WHERE ${characterTable}.ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    createCharacter = async (character) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, character?.ID ?? 0)
            .input('pImage', sql.VarChar, character?.Image ?? '')
            .input('pName', sql.VarChar, character?.Name ?? '')
            .input('pAge', sql.Int, character?.Age ?? 0)
            .input('pWeight', sql.Int, character?.Weight ?? 0)
            .input('pStory', sql.VarChar, character?.Story ?? '')
            .query(`INSERT INTO ${characterTable}(ID, Image, Name, Age, Weight, Story) VALUES (@pID, @pImage, @pName, @pAge, @pWeight, @pStory)`);
        console.log(response)
        return response.recordset;
    }

    updateCharacterById = async (character) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, character?.ID ?? 0)
            .input('pImage', sql.VarChar, character?.Image ?? '')
            .input('pName', sql.VarChar, character?.Name ?? '')
            .input('pAge', sql.Int, character?.Age ?? 0)
            .input('pWeight', sql.Int, character?.Weight ?? 0)
            .input('pStory', sql.VarChar, character?.Story ?? '')
            .query(`UPDATE ${characterTable} SET Image = @pImage, Name = @pName, Age = @pAge, Weight = @pWeight, Story = @pStory WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }

    deleteCharacterById = async (id) => {
        console.log("This is a function on the service");
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('pID', sql.Int, id)
            .query(`DELETE FROM ${characterTable} WHERE ID = @pID`);
        console.log(response)
        return response.recordset;
    }
}

export default new CharacterService();