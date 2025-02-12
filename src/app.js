import express from "express";
import characterRouter from "./routes/character.route.js";
import movieRouter from "./routes/movie.route.js";

const app = express();
app.use(express.json());
app.use('/characters', characterRouter);
app.use('/movies', movieRouter);

export default app;