import "dotenv/config";

const movieTable = process.env.DB_MOVIE_TABLE;

export const buildGetAllMoviesQuery = (title, order) => {
    let query;
    (!title) ? query = `SELECT ID, Image, Title, CreationDate FROM ${movieTable} ORDER BY CreationDate ${order??'ASC'}`
             : query = `SELECT * FROM ${movieTable} WHERE Title = @pTitle ORDER BY CreationDate ${order??'ASC'}`;
    return query;
};