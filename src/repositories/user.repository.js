import { getConnection, sql } from "../database/connection.js";

export default class UserRepository {
  async getByEmail(email){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pEmail', sql.VarChar, email)
      .execute('GetUserByEmail');
    return result.recordset[0];
  };

  async create(email, password){
    const pool = await getConnection();
    const hashedPassword = await getHashedPassword(password);
    const result = await pool.request()
      .input('pEmail', sql.VarChar, email)
      .input('pPassword', sql.VarChar, hashedPassword)
      .execute('CreateUser');
    return result.recordset?.[0]?.RowsAffected > 0;
  };
};