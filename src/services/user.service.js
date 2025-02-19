import { getConnection, sql } from "../database/config.js";
import { getHashedPassword } from "../utils/user.utils.js";
import "dotenv/config";

const userTable = process.env.DB_USER_TABLE;

export default new class UserService {

    getUserByEmail = async (email) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pEmail', sql.VarChar, email)
            .query(`SELECT * FROM ${userTable} WHERE Email = @pEmail`);
        console.log(result);
        return result.recordset[0];
        //return result.recordset[0] || null
    };

    createUser = async (email, password) => {
        console.log("This is a function on the service");
        const pool = await getConnection();
        const hashedPassword = await getHashedPassword(password);
        const result = await pool.request()
            .input('pEmail', sql.VarChar, email)
            .input('pPassword', sql.VarChar, hashedPassword)
            .query(`INSERT INTO ${userTable}(Email, Password) VALUES (@pEmail, @pPassword)`);
        console.log(result);
        return result;
    };
};