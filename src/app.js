import express from "express";
import characterRouter from "./routes/character.route.js";

const app = express();
app.use(express.json());
app.use('/characters', characterRouter);

export default app;