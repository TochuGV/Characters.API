import fs from "fs";

const swagger = JSON.parse(fs.readFileSync("./src/swagger/swagger.json", "utf-8"));
const models = JSON.parse(fs.readFileSync("./src/swagger/components/models.json", "utf-8"));
const parameters = JSON.parse(fs.readFileSync("./src/swagger/components/parameters.json", "utf-8"));
const characterPath = JSON.parse(fs.readFileSync("./src/swagger/paths/characters.json", "utf-8"));

swagger.paths = {
	...swagger.paths,
	...characterPath
}

swagger.components = {
	...swagger.components,
	schemas: {
		...models
	},
	parameters: {
		...parameters
	}
};

export default swagger;