import express from "express";
import helmet from "./config/helmet.config.js";
import cors from "./config/cors.config.js";
import compression from "./config/compression.config.js";
import cookieParser from "./config/cookie-parser.config.js";
import limiter from "./config/rate-limit.config.js";
import passport from "./config/passport.config.js";

import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import characterRouter from "./routes/character.route.js";
import movieRouter from "./routes/movie.route.js";
import notFoundHandler from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/index.js";
import swaggerConfig from "./config/swagger.config.js";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerConfig));

app.use(helmet);
app.use(cors);
app.use(compression);
app.use(express.json());
app.use(cookieParser);
app.use(limiter);

app.use(passport);

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/characters', characterRouter);
app.use('/movies', movieRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;