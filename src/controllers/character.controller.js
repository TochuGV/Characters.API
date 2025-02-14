import { validateCharacter, validateCharacterQuery } from "../schemas/character.schema.js";
import characterService from "../services/character.service.js"

export const getAllCharacters = async (req, res) => {
    console.log("This is a get operation");
    const validation = validateCharacterQuery(req.query);
    console.log(validation.data?.age)
    if(!validation.success){
        return res.status(400).json({ 
            error: "Bad Request", 
            details: JSON.parse(validation.error.message) 
        });
    };
    try {
        const {name, age, weight, movies} = req.query;
        const characters = await characterService.getAllCharacters(name, age, weight, movies);
        if(!characters) return res.status(200).send("Characters not found");
        return res.status(200).json(characters);
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const getCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    try {
        const character = await characterService.getCharacterById(req.params.id);
        if(character) return res.status(200).json(character);
        return res.status(404).send("Character not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const createCharacter = async (req, res) => {
    console.log("This is a post operation");
    const validation = validateCharacter(req.body);
    if(!validation.success){
        return res.status(422).json({ 
            error: "Unprocessable Entity", 
            details: JSON.parse(validation.error.message) 
        });
    };
    try {
        const result = await characterService.createCharacter(req.body);
        if(result.rowsAffected[0] > 0) return res.status(201).send("Character created succesfully");
        return res.status(400).send("Bad request"); //Hay que manejar bien los errores porque es imposible que llegue acá
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error");
    };
};

export const updateCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    const validation = validateCharacter(req.body);
    if(!validation.success){
        return res.status(422).json({ 
            error: "Unprocessable Entity", 
            details: JSON.parse(validation.error.message) 
        });
    };
    try {
        const result = await characterService.updateCharacterById(req.params.id, req.body);
        if(result.rowsAffected[0] > 0) return res.status(200).send("Character updated succesfully");
        return res.status(404).send("Character not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error"); 
    };
};

export const deleteCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    try {
        const result = await characterService.deleteCharacterById(req.params.id);
        if(result.rowsAffected[0] > 0) return res.status(204).send();
        return res.status(404).send("Character not found");
    } catch(error){
        console.error(error);
        return res.status(500).send("Internal server error"); 
    };
};