import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { jwtStrategy } from "./config/jwt.strategy.js";
import authRouter from "./routes/auth.route.js";
import characterRouter from "./routes/character.route.js";
import movieRouter from "./routes/movie.route.js";

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
passport.use("jwt", jwtStrategy);
app.use(passport.initialize());
app.use('/auth', authRouter);
app.use('/characters', characterRouter);
app.use('/movies', movieRouter);

export default app;