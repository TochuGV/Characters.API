import "dotenv/config";

const movieTable = process.env.DB_MOVIE_TABLE;

export const buildGetAllMoviesQuery = (title, order) => {
    let query;
    if (!title) {
        query = `SELECT ID, Image, Title, CreationDate FROM ${movieTable} ORDER BY CreationDate ${order??'ASC'}`
    } else {
        query = `SELECT * FROM ${movieTable} WHERE Title = @pTitle ORDER BY CreationDate ${order??'ASC'}`;
    };
    
    query += ` OFFSET @pOffset ROWS FETCH NEXT @pLimit ROWS ONLY`;
    return query;
};

export const getCurrentCreationDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
}