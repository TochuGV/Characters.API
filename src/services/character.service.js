import { getConnection, sql } from "../database/config.js"

export default class CharacterService {

	static async getAll(name, age, weight, movie, page = 1, limit = 10){
		console.log("This is a function on the service");
		const pool = await getConnection();
		const offset = (page - 1) * limit;
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
		const total = totalResult.recordset[0].Total;
		console.log(result);
		console.log(totalResult);
		return {
			characters: result.recordset,
			total: total,
			currentPage: Number(page),
			totalPages: Math.ceil(total/limit)
		};
	};

	static async getById(id){
		console.log("This is a function on the service");
		const pool = await getConnection();
		const result = await pool.request()
			.input('pID', sql.UniqueIdentifier, id)
			.execute('GetCharacterById');
		console.log(result);
		return result.recordset.length > 0 ? result.recordset : null;
	};

	static async create(character){
		console.log("This is a function on the service");
		const pool = await getConnection();
		const result = await pool.request()
			.input('pImage', sql.VarChar, character.Image)
			.input('pName', sql.VarChar, character.Name)
			.input('pAge', sql.Int, character.Age)
			.input('pWeight', sql.Float, character.Weight)
			.input('pStory', sql.VarChar, character.Story)
			.execute('CreateCharacter');
		console.log(result);
		return result.recordset?.[0]?.RowsAffected > 0;
	};

	static async updateById(id, character){
		console.log("This is a function on the service");
		const pool = await getConnection();
		const result = await pool.request()
			.input('pID', sql.UniqueIdentifier, id)
			.input('pImage', sql.VarChar, character.Image) 
			.input('pName', sql.VarChar, character.Name)
			.input('pAge', sql.Int, character.Age)
			.input('pWeight', sql.Int, character.Weight)
			.input('pStory', sql.VarChar, character.Story)
			.execute('UpdateCharacterById');
		console.log(result);
		return result.recordset?.[0]?.RowsAffected > 0;
	};

	static async deleteById(id){
		console.log("This is a function on the service");
		const pool = await getConnection();
		const result = await pool.request()
			.input('pID', sql.UniqueIdentifier, id)
			.execute('DeleteCharacterById');
		console.log(result);
		return result.recordset?.[0]?.RowsAffected > 0;
	};
};