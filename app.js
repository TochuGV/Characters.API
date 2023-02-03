import express from "express";
import cors from "cors";
import passport from "passport";
import { jwtStrategy } from "./src/common/jwt.strategy.js";
import AuthRouter from "./src/controllers/authController.js";
import CharacterRouter from "./src/controllers/characterController.js"
import MovieRouter from "./src/controllers/movieController.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
passport.use(jwtStrategy);
app.use(passport.initialize());

app.use("/auth", AuthRouter);
app.use("/characters", CharacterRouter);
app.use("/movies", MovieRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});