import prisma from "../src/config/prisma-client.config.js";

import characters from "./data/characters.js";
import movies from "./data/movies.js";
import users from "./data/users.js";

async function main(){
  await prisma.charactersXMovies.deleteMany();
  await prisma.character.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  const movieMap = new Map();

  for (const movie of movies) {
    const createdMovie = await prisma.movie.create({ data: movie });
    // Guardamos en un mapa: "Toy Story" -> "ID-UUID-REAL"
    movieMap.set(movie.title, createdMovie.id);
  };

  for (const char of characters) {
    // Sepamos los títulos del resto de datos del personaje
    const { moviesTitle, ...charData } = char;

    // Buscamos los IDs reales de las películas
    const relations = moviesTitle
      .map(title => movieMap.get(title))
      .filter(id => id) // Por si escribiste mal un nombre
      .map(id => ({ movieId: id }));

    await prisma.character.create({
      data: {
        ...charData,
        // Insertamos la relación en la tabla intermedia
        charactersXMovies: {
          create: relations
        }
      }
    });
  };

  await prisma.user.createMany({
    data: users
  });
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    // Usamos tu instancia para desconectar
    await prisma.$disconnect();
  }
);