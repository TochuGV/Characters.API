import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000", // Podría ser '*' para permitir todos los orígenes.
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

export default cors(corsOptions);