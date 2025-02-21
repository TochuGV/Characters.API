export const tryCatch = (controller) => async (req, res) => { 
    try {
        await controller(req, res);
    } catch(error){
        return res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" });
    }
};