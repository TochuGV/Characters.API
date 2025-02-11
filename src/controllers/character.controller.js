import characterService from "../services/character.service.js"

export const getAllCharacters = async (req, res) => {
    console.log("This is a get operation");
    const characters = await characterService.getAllCharacters()
    return res.status(200).json(characters);
};

export const getCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a get operation");
    const character = await characterService.getCharacterById(req.params.id)
    return res.status(200).json(character);
};

export const createCharacter = async (req, res) => {
    console.log("This is a post operation");
    const character = await characterService.createCharacter(req.body)
    return res.status(200).json(character);
};

export const updateCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    const character = await characterService.updateCharacterById(req.params.id, req.body);
    return res.status(200).json(character);
};

export const deleteCharacterById = async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const character = await characterService.deleteCharacterById(req.params.id);
    return res.status(200).json(character);
};