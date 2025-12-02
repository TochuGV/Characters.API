import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import compressionMiddleware from "./middlewares/compression.middleware.js";
import limiter from "./middlewares/rate-limit.middleware.js";
import { jwtStrategy } from "./config/jwt.strategy.js";
import swaggerOptions from "./config/swagger.config.js";
import corsOptions from "./config/cors.config.js";
import authRouter from "./routes/auth.route.js";
import characterRouter from "./routes/character.route.js";
import movieRouter from "./routes/movie.route.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/index.js";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use(helmet());
app.use(cors(corsOptions));
app.use(compressionMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(limiter)
passport.use("jwt", jwtStrategy);
app.use(passport.initialize());
app.use('/auth', authRouter);
app.use('/characters', characterRouter);
app.use('/movies', movieRouter);
app.use(errorHandler);

export default app;