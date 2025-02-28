import cache from "../cache/cache.js"

export const generateCacheKey = (type, params) => {
    switch(type){
        case "getAllCharacters":
            const { name, age, weight, movie, page: characterPage, limit: characterLimit } = params;
            return `characters:${name}:${age}:${weight}:${movie}:${characterPage}:${characterLimit}`
        case "getCharacterById":
            const { id: characterId } = params;
            return `character:${characterId}`
        case "getAllMovies":
            const { title, order, page: moviePage, limit: movieLimit } = params;
            return `movies:${title}:${order}:${moviePage}:${movieLimit}`
        case "getMovieById":
            const { id: movieId } = params;
            return `movie:${movieId}`
        default:
            return null;
    };
};

export const checkCache = (type, params) => {
    const cacheKey = generateCacheKey(type, params);
    return cache.get(cacheKey);
};

export const setCache = (type, params, data) => {
    const cacheKey = generateCacheKey(type, params);
    cache.set(cacheKey, data);
};

export const deleteCache = (type, params) => {
    const cacheKey = generateCacheKey(type, params);
    cache.del(cacheKey);
};