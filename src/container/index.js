import CharacterRepository from "../repositories/character.repository.js";
import MovieRepository from "../repositories/movie.repository.js";
import UserRepository from "../repositories/user.repository.js";

import CharacterService from "../services/character.service.js";
import MovieService from "../services/movie.service.js";
import UserService from "../services/user.service.js";

import CharacterController from "../controllers/character.controller.js";
import MovieController from "../controllers/movie.controller.js";
import AuthController from "../controllers/auth.controller.js";

const characterRepository = new CharacterRepository();
const characterService = new CharacterService(characterRepository);
export const characterController = new CharacterController(characterService);

const movieRepository = new MovieRepository();
const movieService = new MovieService(movieRepository);
export const movieController = new MovieController(movieService);

const userRepository = new UserRepository();
export const userService = new UserService(userRepository); // Passport
export const authController = new AuthController(userService);