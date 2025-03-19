import compression from "compression";
import "dotenv/config";

export const compressionConfig = {
	threshold: parseInt(process.env.COMPRESSION_THRESHOLD) || 1000,
	level: parseInt(process.env.COMPRESSION_LEVEL) || 6,
	filter: (req, res) => {
		if (req.headers["x-no-compression"]) {
			return false;
		};
		return compression.filter(req, res);
	}
};