import jwt from "jsonwebtoken";
import "dotenv/config";

class AuthService {

  getRandomString = () => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  
  getSignedToken = () => {
    const userId = this.getRandomString();
    const userMail = `${userId}@example.com`;
    const token = jwt.sign(
      {
        payload: "custom payload",
        userEmail: userMail,
      },
      process.env.AUTH0_HS256_KEY,
      {
        issuer: process.env.AUTH_ISSUER_URL,
        subject: userId,
        audience: ["http://localhost/"],
        expiresIn: 60 * 24 * 24,
      }
    );
    return token;
  };
}

export default new AuthService();