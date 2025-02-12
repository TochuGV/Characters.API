import "dotenv/config";

const characterTable = process.env.DB_CHARACTER_TABLE;
const charactersXMoviesTable = process.env.DB_CHARACTERSXMOVIES_TABLE;

export const buildGetAllCharactersQuery = (name, age, weight, movies) => {
    let conditions = [];
    let query = `SELECT ID, Image, Name from ${characterTable}`;
    if(movies){
        query += ` LEFT JOIN ${charactersXMoviesTable} ON ${characterTable}.ID = ${charactersXMoviesTable}.CharacterID`;
        conditions.push(`${charactersXMoviesTable}.MovieID = @pID`);
    };
        
    name ? conditions.push(`Name = @pName`) : null;
    age ? conditions.push(`Age = @pAge`) : null;
    weight ? conditions.push(`Weight = @pWeight`) : null;
    query += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    return query;
};