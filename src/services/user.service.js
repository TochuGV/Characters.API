import { getConnection, sql } from "../database/config.js";
import { getHashedPassword } from "../utils/user.utils.js";

export default new class UserService {

    static async getUserByEmail(email){
        console.log("This is a function on the service");
        const pool = await getConnection();
        const result = await pool.request()
            .input('pEmail', sql.VarChar, email)
            .execute('GetUserByEmail');
        console.log(result);
        return result.recordset[0];
    };

    static async createUser(email, password){
        console.log("This is a function on the service");
        const pool = await getConnection();
        const hashedPassword = await getHashedPassword(password);
        const result = await pool.request()
            .input('pEmail', sql.VarChar, email)
            .input('pPassword', sql.VarChar, hashedPassword)
            .query('CreateUser');
        console.log(result);
        return result.rowsAffected[0] > 0;
    };
};