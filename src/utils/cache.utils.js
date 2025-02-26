import cache from "../cache/cache.js"

export const generateCacheKey = (type, params) => {
    switch(type){
        case "getAllCharacters":
            const { name, age, weight, movies, characterPage, characterLimit } = params;
            return `characters:${name}:${age}:${weight}:${movies}:${characterPage}:${characterLimit}`
        case "getCharacterById":
            const { characterId } = params;
            return `character:${characterId}`
        case "getAllMovies":
            const { title, order, moviePage, movieLimit } = params;
            return `movies:${title}:${order}:${moviePage}:${movieLimit}`
        case "getMovieById":
            const { movieId } = params;
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