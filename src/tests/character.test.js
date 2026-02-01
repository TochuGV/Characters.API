import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma-client.config.js';

describe('Characters: Integration Tests', () => {
  let authToken;
  let adminUser;

  const createdCharacterIds = [];

  beforeAll(async () => {
    const timestamp = Date.now();
    const credentials = {
      email: `admin.test.${timestamp}@example.com`,
      password: 'SecurePass123!',
      name: 'Test Admin'
    };

    await request(app)
      .post('/auth/register')
      .send(credentials);

    adminUser = await prisma.user.findFirst({
      where: { email: credentials.email }
    });

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: 'ADMIN' }
    });

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

  afterAll(async () => {
    if (createdCharacterIds.length > 0) {
      await prisma.character.deleteMany({
        where: {
          id: { in: createdCharacterIds }
        }
      }).catch(() => {});
    }

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

  describe('GET /characters', () => {
    it('should return list of characters with pagination', async () => {
      const res = await request(app)
        .get('/characters')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
      
      const { characters, pagination } = res.body.data;

      expect(Array.isArray(characters)).toBe(true);
      
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('currentPage');
      expect(pagination).toHaveProperty('totalPages');

      if (characters.length > 0) {
        const char = characters[0];
        expect(char).toHaveProperty('id');
        expect(char).toHaveProperty('name');
        expect(char).toHaveProperty('image');
      }
    });

    it('should filter characters by name', async () => {
      const res = await request(app)
        .get('/characters?name=Woody')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      const { characters } = res.body.data;
      
      expect(Array.isArray(characters)).toBe(true);
    });

    it('should apply pagination parameters', async () => {
      const res = await request(app)
        .get('/characters?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      const { characters, pagination } = res.body.data;

      expect(characters.length).toBeLessThanOrEqual(5);
      expect(pagination.perPage).toBe(5);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/characters');
      
      expect(res.status).toBe(401);
    });
  });

  describe('GET /characters/:id', () => {
    it('should return character details', async () => {
      const listRes = await request(app)
        .get('/characters')
        .set('Authorization', `Bearer ${authToken}`);

      const firstCharacter = listRes.body.data.characters[0];
      expect(firstCharacter).toBeDefined();

      const res = await request(app)
        .get(`/characters/${firstCharacter.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('id', firstCharacter.id);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('image');
      expect(res.body.data).toHaveProperty('movies');
    });

    it('should return 404 for non-existent character', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .get(`/characters/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 422 for invalid UUID format', async () => {
      const res = await request(app)
        .get('/characters/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(422);
    });
  });

  describe('POST /characters', () => {
    const validCharacterData = {
      name: 'Test Character',
      image: 'https://example.com/test.jpg',
      age: 25,
      weight: 70.5,
      story: 'A test character created during integration testing'
    };

    it('should create a new character', async () => {
      const res = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCharacterData);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(validCharacterData.name);

      createdCharacterIds.push(res.body.data.id);
    });

    it('should enforce idempotency with same key', async () => {
      const idempotencyKey = `test-key-${Date.now()}`;
      
      const res1 = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          name: 'Idempotent Test',
          image: 'https://example.com/idempotent.jpg'
        });

      expect(res1.status).toBe(201);
      const firstId = res1.body.data.id;
      createdCharacterIds.push(firstId);

      const res2 = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          name: 'Idempotent Test',
          image: 'https://example.com/idempotent.jpg'
        });

      expect(res2.status).toBe(201);
      expect(res2.body.data.id).toBe(firstId);
    });

    it('should create different characters with different idempotency keys', async () => {
      const res1 = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', `key-${Date.now()}-1`)
        .send({
          name: 'Character One',
          image: 'https://example.com/one.jpg'
        });

      const res2 = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', `key-${Date.now()}-2`)
        .send({
          name: 'Character Two',
          image: 'https://example.com/two.jpg'
        });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data.id).not.toBe(res2.body.data.id);

      createdCharacterIds.push(res1.body.data.id, res2.body.data.id);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Invalid',
          image: 'not-a-url'
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('details');
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          age: 30
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
        .post('/characters')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validCharacterData);

      expect(res.status).toBe(403);

      const user = await prisma.user.findFirst({ where: { email: userCreds.email } });
      if (user) {
        await prisma.userSession.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    });
  });

  describe('PUT /characters/:id', () => {
    let characterToUpdate;

    beforeEach(async () => {
      const res = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Character To Update',
          image: 'https://example.com/update.jpg',
          age: 20
        });

      characterToUpdate = res.body.data;
      createdCharacterIds.push(characterToUpdate.id);
    });

    it('should update character successfully', async () => {
      const updates = {
        name: 'Updated Name',
        image: 'https://example.com/updated.jpg',
        age: 30,
        story: 'Updated story'
      };

      const res = await request(app)
        .put(`/characters/${characterToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(updates.name);
      expect(res.body.data.age).toBe(updates.age);
    });

    it('should be idempotent (same update twice)', async () => {
      const updates = { name: 'Same Update', image: 'https://example.com/same.jpg' };

      const res1 = await request(app)
        .put(`/characters/${characterToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      const res2 = await request(app)
        .put(`/characters/${characterToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res2.body.data.name).toBe(updates.name);
    });

    it('should return 404 for non-existent character', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const res = await request(app)
        .put(`/characters/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Ghost',
          image: 'https://example.com/ghost.jpg'
        });

      expect(res.status).toBe(404);
    });

    it('should reject invalid update data', async () => {
      const res = await request(app)
        .put(`/characters/${characterToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Valid',
          image: 'invalid-url'
        });

      expect(res.status).toBe(422);
    });
  });

  describe('DELETE /characters/:id', () => {
    it('should delete character and return 204', async () => {
      const createRes = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'To Delete',
          image: 'https://example.com/delete.jpg'
        });

      const charId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/characters/${charId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/characters/${charId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should be idempotent (same effect on multiple deletes)', async () => {
      const createRes = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Idempotent Delete',
          image: 'https://example.com/idempotent-delete.jpg'
        });

      const charId = createRes.body.data.id;

      const res1 = await request(app)
        .delete(`/characters/${charId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res1.status).toBe(204);

      const res2 = await request(app)
        .delete(`/characters/${charId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res2.status).toBe(404);
      
      const getRes = await request(app)
        .get(`/characters/${charId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getRes.status).toBe(404);
    });

    it('should return 422 for invalid UUID', async () => {
      const res = await request(app)
        .delete('/characters/not-a-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(422);
    });
  });
});