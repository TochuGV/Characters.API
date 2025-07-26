import cache from "../cache/cache.js"

const generateCacheKey = (type, params) => {
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

const clearCacheByType = (type) => {
  const prefix = type === "characters" ? "characters" : type === "movies" ? "movies" : null;
  if(prefix) {
    cache.keys().forEach(key => {
      if(key.startsWith(prefix)) cache.del(key);
    });
  };
};

export const deleteCache = (type, params) => {
  if(type === "getAllCharacters" || type === "getAllMovies"){
    clearCacheByType(type === "getAllCharacters" ? "characters" : "movies");
  } else {
    const cacheKey = generateCacheKey(type, params);
    cache.del(cacheKey);
  };
};