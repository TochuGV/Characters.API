import app from "./app.js"
import "dotenv/config";

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Hello World!"));

app.listen(port, ()=>{
	console.log(`Server running on port ${port}`);
});
