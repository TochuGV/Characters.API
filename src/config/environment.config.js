import z from "zod";

const envSchema = z.object({
  // --- SERVER ---
  PORT: z.string().default("3000"),

  // --- DATABASE CONFIGURATION ---
  DB_USER: z.string({ required_error: "DB_USER is required" }),
  DB_PASSWORD: z.string({ required_error: "DB_PASSWORD is required" }),
  DB_SERVER: z.string({ required_error: "DB_SERVER is required" }),
  DB_NAME: z.string({ required_error: "DB_NAME is required" }),

  // --- DATABASE TABLES ---
  DB_CHARACTER_TABLE: z.string().default("Character"),
  DB_MOVIE_TABLE: z.string().default("Movie"),
  DB_CHARACTERSXMOVIES_TABLE: z.string().default("CharactersXMovies"),
  DB_USER_TABLE: z.string().default("User"),

  // --- SECURITY ---
  JWT_ACCESS_SECRET_KEY: z.string({ required_error: "JWT_ACCESS_SECRET_KEY is required" }),
  JWT_REFRESH_SECRET_KEY: z.string({ required_error: "JWT_REFRESH_SECRET_KEY is required" }),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  SALT_ROUNDS: z.coerce.number().default(10),

  // --- RATE LIMIT ---
  RATE_LIMIT_WINDOW: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(60),

  // --- COMPRESSION ---
  COMPRESSION_THRESHOLD: z.coerce.number().default(1000),
  COMPRESSION_LEVEL: z.coerce.number().default(6),

  // --- CACHE ---
  CACHE_TTL_REDIS: z.coerce.number().int().positive().default(3600),
  CACHE_TTL_LOCAL: z.coerce.number().int().positive().default(60),
  CACHE_CHECK_PERIOD_LOCAL: z.coerce.number().int().positive().default(600),

  // --- REDIS ---
  USE_REDIS: z.enum(["true", "false"]).transform((val) => val === "true").default("true"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // --- LOGGER ---
  LOG_LEVEL: z.string().default("info"),
});

const environmentVariables = envSchema.safeParse(process.env);

if (!environmentVariables.success) {
  console.error("❌ FATAL ERROR: Invalid Environment Variables");
  console.error("---------------------------------------------");

  const formattedErrors = environmentVariables.error.issues.map((issue) => ({
    Variable: issue.path.join("."),
    Error: issue.message,
  }));

  console.table(formattedErrors);
  process.exit(1);
};

export default environmentVariables.data;