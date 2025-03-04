import fs from "fs";

const swaggerPaths = JSON.parse(fs.readFileSync("./src/swagger/paths.json", "utf-8"));
const swaggerSchemas = JSON.parse(fs.readFileSync("./src/swagger/schemas.json", "utf-8"));
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger/swagger.json", "utf-8"));

swaggerDocument.paths = swaggerPaths;
swaggerDocument.components = { schemas: swaggerSchemas };

export default swaggerDocument;