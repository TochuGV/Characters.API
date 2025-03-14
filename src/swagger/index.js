import fs from "fs";

const swagger = JSON.parse(fs.readFileSync("./src/swagger/swagger.json", "utf-8"));
const characterPath = JSON.parse(fs.readFileSync("./src/swagger/paths/characters.json", "utf-8"));
const schemas = JSON.parse(fs.readFileSync("./src/swagger/components/schemas.json", "utf-8"));
const responses = JSON.parse(fs.readFileSync("./src/swagger/components/responses.json", "utf-8"));
const requests = JSON.parse(fs.readFileSync("./src/swagger/components/requests.json", "utf-8"));
const parameters = JSON.parse(fs.readFileSync("./src/swagger/components/parameters.json", "utf-8"));
const securitySchemes = JSON.parse(fs.readFileSync("./src/swagger/components/securitySchemes.json", "utf-8"));

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