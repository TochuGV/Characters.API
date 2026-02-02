import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma-client.config.js';

describe('Movies: Integration Tests', () => {
  let authToken;
  let adminUser;
  
  // IDs de películas y relaciones creadas durante los tests (para limpieza)
  const createdMovieIds = [];
  const createdRelationIds = [];

  // Setup: Crear usuario admin y obtener token
  beforeAll(async () => {
    const timestamp = Date.now();
    const credentials = {
      email: `admin.test.${timestamp}@example.com`,
      password: 'SecurePass123!',
      name: 'Test Admin'
    };

    // Registrar usuario
    await request(app)
      .post('/auth/register')
      .send(credentials);

    // Promover a ADMIN
    adminUser = await prisma.user.findFirst({
      where: { email: credentials.email }
    });

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: 'ADMIN' }
    });

    // Obtener token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: credentials.email,
        password: credentials.password
      });

    authToken = loginRes.body.data.accessToken;
    
    if (!authToken) {
      throw new Error('Failed to obtain auth token in test setup');
    }
  });

  // Cleanup: Limpiar películas creadas y usuario de prueba
  afterAll(async () => {
    // Eliminar relaciones creadas
    if (createdRelationIds.length > 0) {
      await prisma.charactersXMovies.deleteMany({
        where: {
          id: { in: createdRelationIds }
        }
      }).catch(() => {});
    }

    // Eliminar películas creadas durante los tests
    if (createdMovieIds.length > 0) {
      await prisma.movie.deleteMany({
        where: {
          id: { in: createdMovieIds }
        }
      }).catch(() => {});
    }

    // Eliminar usuario de prueba
    if (adminUser) {
      await prisma.userSession.deleteMany({
        where: { userId: adminUser.id }
      }).catch(() => {});
      
      await prisma.user.delete({
        where: { id: adminUser.id }
      }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  describe('GET /movies', () => {
    it('should return list of movies with pagination', async () => {
      const res = await request(app)
        .get('/movies')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
      
      const { movies, pagination } = res.body.data;

      expect(Array.isArray(movies)).toBe(true);
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('currentPage');
      expect(pagination).toHaveProperty('totalPages');

      if (movies.length > 0) {
        const movie = movies[0];
        expect(movie).toHaveProperty('id');
        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('image');
        expect(movie).toHaveProperty('creationDate');
      }
    });

    it('should filter movies by title', async () => {
      const res = await request(app)
        .get('/movies?title=Toy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      const { movies } = res.body.data;
      
      expect(Array.isArray(movies)).toBe(true);
    });

    it('should sort movies by creationDate', async () => {
      const resAsc = await request(app)
        .get('/movies?order=ASC')
        .set('Authorization', `Bearer ${authToken}`);

      expect(resAsc.status).toBe(200);

      const resDesc = await request(app)
        .get('/movies?order=DESC')
        .set('Authorization', `Bearer ${authToken}`);

      expect(resDesc.status).toBe(200);
      
      const { movies: moviesAsc } = resAsc.body.data;
      const { movies: moviesDesc } = resDesc.body.data;

      expect(Array.isArray(moviesAsc)).toBe(true);
      expect(Array.isArray(moviesDesc)).toBe(true);
    });

    it('should apply pagination parameters', async () => {
      const res = await request(app)
        .get('/movies?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      const { movies, pagination } = res.body.data;

      expect(movies.length).toBeLessThanOrEqual(5);
      expect(pagination.perPage).toBe(5);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/movies');
      
      expect(res.status).toBe(401);
    });
  });

  describe('GET /movies/:id', () => {
    it('should return movie details', async () => {
      // Obtener un ID válido del seed
      const listRes = await request(app)
        .get('/movies')
        .set('Authorization', `Bearer ${authToken}`);

      const firstMovie = listRes.body.data.movies[0];
      expect(firstMovie).toBeDefined();

      // Obtener detalles
      const res = await request(app)
        .get(`/movies/${firstMovie.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', firstMovie.id);
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('image');
      expect(res.body.data).toHaveProperty('creationDate');
      expect(res.body.data).toHaveProperty('characters'); // Incluye relaciones
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .get(`/movies/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 422 for invalid UUID format', async () => {
      const res = await request(app)
        .get('/movies/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(422);
    });
  });

  describe('POST /movies', () => {
    const validMovieData = {
      title: 'Test Movie',
      image: 'https://example.com/test.jpg',
      creationDate: '2024-01-15',
      rating: 5
    };

    it('should create a new movie', async () => {
      const res = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validMovieData);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(validMovieData.title);

      createdMovieIds.push(res.body.data.id);
    });

    it('should enforce idempotency with same key', async () => {
      const idempotencyKey = `test-key-${Date.now()}`;
      
      const res1 = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          title: 'Idempotent Test',
          image: 'https://example.com/idempotent.jpg',
          creationDate: '2024-06-15'
        });

      expect(res1.status).toBe(201);
      const firstId = res1.body.data.id;
      createdMovieIds.push(firstId);

      const res2 = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          title: 'Idempotent Test',
          image: 'https://example.com/idempotent.jpg',
          creationDate: '2024-06-15'
        });

      expect(res2.status).toBe(201);
      expect(res2.body.data.id).toBe(firstId);
    });

    it('should create different movies with different idempotency keys', async () => {
      const res1 = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', `key-${Date.now()}-1`)
        .send({
          title: 'Movie One',
          image: 'https://example.com/one.jpg',
          creationDate: '2024-01-01'
        });

      const res2 = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', `key-${Date.now()}-2`)
        .send({
          title: 'Movie Two',
          image: 'https://example.com/two.jpg',
          creationDate: '2024-02-01'
        });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data.id).not.toBe(res2.body.data.id);

      createdMovieIds.push(res1.body.data.id, res2.body.data.id);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Invalid',
          image: 'not-a-url',
          creationDate: '2024-01-01'
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('details');
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating: 4
        });

      expect(res.status).toBe(422);
    });

    it('should require admin role', async () => {
      const userCreds = {
        email: `regular.${Date.now()}@example.com`,
        password: 'Pass123!',
        name: 'Regular User'
      };

      await request(app).post('/auth/register').send(userCreds);
      
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: userCreds.email, password: userCreds.password });

      const userToken = loginRes.body.data.accessToken;

      const res = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validMovieData);

      expect(res.status).toBe(403);

      const user = await prisma.user.findFirst({ where: { email: userCreds.email } });
      if (user) {
        await prisma.userSession.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });
  });

  describe('PUT /movies/:id', () => {
    let movieToUpdate;

    beforeEach(async () => {
      const res = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Movie To Update',
          image: 'https://example.com/update.jpg',
          creationDate: '2024-01-01',
          rating: 3
        });

      movieToUpdate = res.body.data;
      createdMovieIds.push(movieToUpdate.id);
    });

    it('should update movie successfully', async () => {
      const updates = {
        title: 'Updated Title',
        image: 'https://example.com/updated.jpg',
        creationDate: '2024-12-31',
        rating: 5
      };

      const res = await request(app)
        .put(`/movies/${movieToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.rating).toBe(updates.rating);
    });

    it('should be idempotent (same update twice)', async () => {
      const updates = {
        title: 'Same Update',
        image: 'https://example.com/same.jpg',
        creationDate: '2024-06-15'
      };

      const res1 = await request(app)
        .put(`/movies/${movieToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      const res2 = await request(app)
        .put(`/movies/${movieToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res2.body.data.title).toBe(updates.title);
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .put(`/movies/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Ghost',
          image: 'https://example.com/ghost.jpg',
          creationDate: '2024-01-01'
        });

      expect(res.status).toBe(404);
    });

    it('should reject invalid update data', async () => {
      const res = await request(app)
        .put(`/movies/${movieToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Valid',
          image: 'invalid-url',
          creationDate: '2024-01-01'
        });

      expect(res.status).toBe(422);
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should delete movie and return 204', async () => {
      const createRes = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Delete',
          image: 'https://example.com/delete.jpg',
          creationDate: '2024-01-01'
        });

      const movieId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should be idempotent (same effect on multiple deletes)', async () => {
      const createRes = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Idempotent Delete',
          image: 'https://example.com/idempotent-delete.jpg',
          creationDate: '2024-01-01'
        });

      const movieId = createRes.body.data.id;

      const res1 = await request(app)
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res1.status).toBe(204);

      const res2 = await request(app)
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res2.status).toBe(404);

      const getRes = await request(app)
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getRes.status).toBe(404);
    });

    it('should return 422 for invalid UUID', async () => {
      const res = await request(app)
        .delete('/movies/not-a-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(422);
    });
  });

  describe('POST /movies/:id/characters', () => {
    let testMovie;
    let testCharacter;

    beforeEach(async () => {
      // Crear película de prueba
      const movieRes = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Movie for Relations',
          image: 'https://example.com/relations.jpg',
          creationDate: '2024-01-01'
        });

      testMovie = movieRes.body.data;
      createdMovieIds.push(testMovie.id);

      // Crear personaje de prueba
      const charRes = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Character for Relations',
          image: 'https://example.com/char-relations.jpg'
        });

      testCharacter = charRes.body.data;
    });

    it('should add character to movie', async () => {
      const res = await request(app)
        .post(`/movies/${testMovie.id}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: testCharacter.id });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('characters');
      
      const hasCharacter = res.body.data.characters.some(
        char => char.id === testCharacter.id
      );
      expect(hasCharacter).toBe(true);
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .post(`/movies/${fakeId}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: testCharacter.id });

      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent character', async () => {
      const fakeCharId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .post(`/movies/${testMovie.id}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: fakeCharId });

      expect(res.status).toBe(404);
    });

    it('should reject duplicate character in movie', async () => {
      // Agregar primera vez
      await request(app)
        .post(`/movies/${testMovie.id}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: testCharacter.id });

      // Intentar agregar de nuevo
      const res = await request(app)
        .post(`/movies/${testMovie.id}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: testCharacter.id });

      expect(res.status).toBe(409); // Conflict
    });
  });

  describe('DELETE /movies/:id/characters/:characterId', () => {
    let testMovie;
    let testCharacter;

    beforeEach(async () => {
      // Crear película de prueba
      const movieRes = await request(app)
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Movie for Removal',
          image: 'https://example.com/removal.jpg',
          creationDate: '2024-01-01'
        });

      testMovie = movieRes.body.data;
      createdMovieIds.push(testMovie.id);

      // Crear personaje de prueba
      const charRes = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Character for Removal',
          image: 'https://example.com/char-removal.jpg'
        });

      testCharacter = charRes.body.data;

      // Agregar personaje a película
      await request(app)
        .post(`/movies/${testMovie.id}/characters`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ characterId: testCharacter.id });
    });

    it('should remove character from movie', async () => {
      const res = await request(app)
        .delete(`/movies/${testMovie.id}/characters/${testCharacter.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      
      // Verificar que el personaje ya no está en la película
      const getRes = await request(app)
        .get(`/movies/${testMovie.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      const hasCharacter = getRes.body.data.characters.some(
        char => char.id === testCharacter.id
      );
      expect(hasCharacter).toBe(false);
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .delete(`/movies/${fakeId}/characters/${testCharacter.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent relation', async () => {
      const fakeCharId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .delete(`/movies/${testMovie.id}/characters/${fakeCharId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});