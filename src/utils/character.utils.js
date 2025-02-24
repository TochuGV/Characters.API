import "dotenv/config";
import z from "zod";

const characterTable = process.env.DB_CHARACTER_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

export const buildGetAllCharactersQuery = (name, age, weight, movies) => {
    let conditions = [];
    let query = `SELECT ID, Image, Name FROM ${characterTable}`;
    if(movies){
        query += ` LEFT JOIN ${charactersXMoviesTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID`;
        conditions.push(`${charactersXMoviesTable}.MovieID = @pMovieID`);
    };
        
    name ? conditions.push(`Name = @pName`) : null;
    age ? conditions.push(`Age = @pAge`) : null;
    weight ? conditions.push(`Weight = @pWeight`) : null;
    query += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    query += ` ORDER BY ID OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY`;
    return query;
};

export const parseNumericQueryParam = (val) => {
    if(typeof val !== "string") return undefined;
    const num = Number(val);
    return (isNaN(num)) ? z.NEVER : num;
};