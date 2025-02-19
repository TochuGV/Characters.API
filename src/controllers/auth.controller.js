import { validateUser } from "../schemas/user.schema.js";
import { generateToken } from "../services/auth.service.js";
import userService from "../services/user.service.js";
import { comparePasswords } from "../utils/user.utils.js";

export const registerUser = async (req, res) => {
    console.log("This is a post operation");
    const validation = validateUser(req.body);
    if(!validation.success){
        return res.status(400).json({
            error: "Bad Request",
            details: JSON.parse(validation.error.message)
        });
    };
    try {
        const {email, password} = req.body
        const userExists = await userService.getUserByEmail(email);
        if(userExists) return res.status(400).send("User already exists");
        const result = await userService.createUser(email, password);
        if(result.rowsAffected[0] > 0) return res.status(201).send("User created successfully");
        return res.status(400).send("Bad request");
    } catch(error){
        console.error(error);
        return res.status(500).send("An error ocurred while creating the user")
    };  
};

export const loginUser = async (req, res) => {
    console.log("This is a post operation");
    const validation = validateUser(req.body);
    if(!validation.success){
        return res.status(400).json({
            error: "Bad Request",
            details: JSON.parse(validation.error.message)
        });
    };
    try {
        const {email, password} = req.body;
        const user = await userService.getUserByEmail(email);
        if(!user) return res.status(400).send("Invalid credentials");

        const isValidPassword = await comparePasswords(password, user.Password);
        if(!isValidPassword) return res.status(400).send("Invalid credentials, wrong password");
        const token = generateToken(user);
        res.cookie("jwt", token, {
            httpOnly: true,
            //secure: true,
            //samSite: strict
        });
        return res.status(200).send("Login successful");
    } catch(error) {
        console.log(error)
        return res.status(500).send("An error occured while logging in");
    };
};