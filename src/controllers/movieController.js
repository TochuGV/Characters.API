import { Router } from "express";
import movieService from "../services/movieService.js"
import { authMiddleware } from "../common/jwt.strategy.js";

const router = Router();

router.post('', authMiddleware, async (req, res) => {
    console.log("This is a post operation");
    let rating = req.body.rating;
    if((rating < 1 || rating > 5)){
        return res.status(404).json("Movie rating must be between one and five stars")
    }
    const movie = await movieService.createMovie(req.body)
    return res.status(200).json(movie)
})

router.put('/:id', authMiddleware, async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a put operation");
    let rating = req.body.rating;
    if((rating < 1 || rating > 5)){
        return res.status(404).json("Movie rating must be between one and five stars")
    }
    const movie = await movieService.updateMovieById(req.params.id, req.body)
    return res.status(200).json(movie)
})

router.delete('/:id', authMiddleware, async (req, res) => {
    console.log(`Request URL Param: ${req.params.id}`);
    console.log("This is a delete operation");
    const movie = await movieService.deleteMovieById(req.params.id)
    return res.status(200).json(movie)
})

export default router;