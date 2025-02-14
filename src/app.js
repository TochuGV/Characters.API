import express from "express";
import cors from "cors";
import characterRouter from "./routes/character.route.js";
import movieRouter from "./routes/movie.route.js";

const app = express();
app.use(cors())
app.use(express.json());
app.use('/characters', characterRouter);
app.use('/movies', movieRouter);

export default app;