import fs from "fs";

const readJSONFile = (path) => JSON.parse(fs.readFileSync(path, "utf-8"));

const swagger = readJSONFile("./src/swagger/swagger.json");
const characterPath = readJSONFile("./src/swagger/paths/characters.json");
const schemas = readJSONFile("./src/swagger/components/schemas.json");
const responses = readJSONFile("./src/swagger/components/responses.json");
const requests = readJSONFile("./src/swagger/components/requests.json");
const parameters = readJSONFile("./src/swagger/components/parameters.json");
const securitySchemes = readJSONFile("./src/swagger/components/securitySchemes.json");

swagger.paths = {
	...swagger.paths,
	...characterPath
}

swagger.components = {
	...swagger.components,
	schemas: {
		...schemas
	},
	responses: {
		...responses
	},
	requests: {
		...requests
	},
	parameters: {
		...parameters
	},
	securitySchemes: {
		...securitySchemes
	}
};

export default swagger;