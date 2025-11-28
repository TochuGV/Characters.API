import { getConnection, sql } from "../database/config.js"

export default class CharacterRepository {
  async getAll(name, age, weight, movie, offset, limit){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pName', sql.VarChar, name)
      .input('pAge', sql.Int, age)
      .input('pWeight', sql.Float, weight)
      .input('pMovieID', sql.UniqueIdentifier, movie)
      .input('pOffset', sql.Int, offset)
      .input('pLimit', sql.Int, limit)
      .execute('GetCharacters');
    const totalResult = await pool.request()
      .input('pName', sql.VarChar, name)
      .input('pAge', sql.Int, age)
      .input('pWeight', sql.Float, weight)
      .input('pMovieID', sql.UniqueIdentifier, movie)
      .execute('GetCharactersCount');
    return {
      items: result.recordset,
      total: totalResult.recordset[0].Total,
    };
  };

  async getById(id){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .execute('GetCharacterById');
    return result.recordset[0];
  };

  async create(character){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pImage', sql.VarChar, character.Image)
      .input('pName', sql.VarChar, character.Name)
      .input('pAge', sql.Int, character.Age)
      .input('pWeight', sql.Float, character.Weight)
      .input('pStory', sql.VarChar, character.Story)
      .execute('CreateCharacter');
    return result.recordset?.[0]?.RowsAffected > 0;
  };

  async updateById(id, character){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .input('pImage', sql.VarChar, character.Image) 
      .input('pName', sql.VarChar, character.Name)
      .input('pAge', sql.Int, character.Age)
      .input('pWeight', sql.Int, character.Weight)
      .input('pStory', sql.VarChar, character.Story)
      .execute('UpdateCharacterById');
    return result.recordset?.[0]?.RowsAffected > 0;
  };

  async deleteById(id){
    const pool = await getConnection();
    const result = await pool.request()
      .input('pID', sql.UniqueIdentifier, id)
      .execute('DeleteCharacterById');
    return result.recordset?.[0]?.RowsAffected > 0;
  };
};