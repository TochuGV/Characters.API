import prisma from "../src/config/prisma-client.config.js";

import characters from "./data/characters.js";
import movies from "./data/movies.js";
import users from "./data/users.js";

const main = async () => {
  await prisma.userSession.deleteMany();
  await prisma.charactersXMovies.deleteMany();
  await prisma.character.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  const movieMap = new Map();

  for (const movie of movies) {
    const createdMovie = await prisma.movie.create({ data: movie });
    movieMap.set(movie.title, createdMovie.id);
  };

  for (const char of characters) {
    const { moviesTitle, ...charData } = char;

    const relations = moviesTitle
      .map(title => movieMap.get(title))
      .filter(id => id) // Por si se escribió mal algún título de la película
      .map(id => ({ movieId: id }));

    await prisma.character.create({
      data: {
        ...charData,
        charactersXMovies: {
          create: relations
        }
      }
    });
  };

  await prisma.user.createMany({
    data: users
  });

  console.log("Database seed completed successfully!");
};

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }
);