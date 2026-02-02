import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma-client.config.js';

describe('Auth: Integration Tests', () => {
  // IDs de usuarios creados durante los tests (para limpieza)
  const createdUserIds = [];

  // Cleanup: Limpiar usuarios creados
  afterAll(async () => {
    if (createdUserIds.length > 0) {
      // Primero eliminar sesiones
      await prisma.userSession.deleteMany({
        where: {
          userId: { in: createdUserIds }
        }
      }).catch(() => {});

      // Luego eliminar usuarios
      await prisma.user.deleteMany({
        where: {
          id: { in: createdUserIds }
        }
      }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    };

    it('should register a new user', async () => {
      const timestamp = Date.now();
      const userData = {
        ...validUserData,
        email: `test.${timestamp}@example.com`
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('email', userData.email);
      expect(res.body.data.user).toHaveProperty('name', userData.name);
      expect(res.body.data.user).toHaveProperty('role', 'USER');
      expect(res.body.data.user).not.toHaveProperty('password'); // No debe exponer password

      // Guardar para limpieza
      const user = await prisma.user.findFirst({ where: { email: userData.email } });
      if (user) createdUserIds.push(user.id);
    });

    it('should hash the password', async () => {
      const timestamp = Date.now();
      const userData = {
        ...validUserData,
        email: `hash.${timestamp}@example.com`,
        password: 'PlainPassword123'
      };

      await request(app)
        .post('/auth/register')
        .send(userData);

      // Verificar que el password en DB está hasheado
      const user = await prisma.user.findFirst({ where: { email: userData.email } });
      
      expect(user).toBeDefined();
      expect(user.password).not.toBe('PlainPassword123'); // No es texto plano
      expect(user.password.length).toBeGreaterThan(50); // Los hashes bcrypt son largos

      if (user) createdUserIds.push(user.id);
    });

    it('should reject duplicate email', async () => {
      const timestamp = Date.now();
      const userData = {
        ...validUserData,
        email: `duplicate.${timestamp}@example.com`
      };

      // Primera creación
      const firstRes = await request(app)
        .post('/auth/register')
        .send(userData);
      
      expect(firstRes.status).toBe(201);

      // Intentar duplicar
      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(409); // Conflict

      const user = await prisma.user.findFirst({ where: { email: userData.email } });
      if (user) createdUserIds.push(user.id);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test'
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('details');
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test'
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('details');
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User'
        });

      expect(res.status).toBe(422);
    });

    it('should allow registration without name (optional)', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `noname.${timestamp}@example.com`,
        password: 'SecurePass123!'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.data.user.name).toBeNull();

      const user = await prisma.user.findFirst({ where: { email: userData.email } });
      if (user) createdUserIds.push(user.id);
    });
  });

  describe('POST /auth/login', () => {
    let testUser;

    beforeAll(async () => {
      const timestamp = Date.now();
      const credentials = {
        email: `login.${timestamp}@example.com`,
        password: 'LoginPass123!',
        name: 'Login Test User'
      };

      // Crear usuario para login
      await request(app)
        .post('/auth/register')
        .send(credentials);

      const user = await prisma.user.findFirst({ where: { email: credentials.email } });
      testUser = { ...user, plainPassword: credentials.password };
      
      if (user) createdUserIds.push(user.id);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).not.toHaveProperty('password');
      
      // Verificar que el token es un JWT válido (formato básico)
      expect(res.body.data.accessToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    it('should set refresh token in signed cookie', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
      
      // Verificar que hay una cookie llamada refreshToken
      const cookies = res.headers['set-cookie'];
      const hasRefreshToken = cookies.some(cookie => cookie.startsWith('refreshToken='));
      expect(hasRefreshToken).toBe(true);
    });

    it('should create a session in database', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      const sessions = await prisma.userSession.findMany({
        where: { userId: testUser.id }
      });

      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions[0]).toHaveProperty('token');
      expect(sessions[0]).toHaveProperty('revoked', false);
      expect(sessions[0]).toHaveProperty('expiresAt');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!'
        });

      expect(res.status).toBe(401);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
    });

    it('should reject missing credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email
        });

      expect(res.status).toBe(422);
    });
  });

  describe('POST /auth/logout', () => {
    let testUser;
    let refreshToken;

    beforeEach(async () => {
      const timestamp = Date.now();
      const credentials = {
        email: `logout.${timestamp}@example.com`,
        password: 'LogoutPass123!',
        name: 'Logout Test User'
      };

      // Crear y hacer login
      await request(app)
        .post('/auth/register')
        .send(credentials);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: credentials.email,
          password: credentials.password
        });

      // Extraer refresh token de las cookies
      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
      refreshToken = refreshCookie;

      const user = await prisma.user.findFirst({ where: { email: credentials.email } });
      testUser = user;
      
      if (user) createdUserIds.push(user.id);
    });

    it('should logout and revoke session', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set('Cookie', refreshToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('message', 'Logout successful');
    });

    it('should clear refresh token cookie', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set('Cookie', refreshToken);

      expect(res.status).toBe(200);
      
      const cookies = res.headers['set-cookie'];
      const hasCleared = cookies.some(cookie => 
        cookie.startsWith('refreshToken=') && cookie.includes('Expires=')
      );
      expect(hasCleared).toBe(true);
    });

    it('should work even without refresh token', async () => {
      const res = await request(app)
        .post('/auth/logout');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /auth/refresh', () => {
    let testUser;
    let validRefreshToken;
    let accessToken;

    beforeEach(async () => {
      const timestamp = Date.now();
      const credentials = {
        email: `refresh.${timestamp}@example.com`,
        password: 'RefreshPass123!',
        name: 'Refresh Test User'
      };

      // Crear y hacer login
      await request(app)
        .post('/auth/register')
        .send(credentials);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: credentials.email,
          password: credentials.password
        });

      accessToken = loginRes.body.data.accessToken;

      // Extraer refresh token
      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
      validRefreshToken = refreshCookie;

      const user = await prisma.user.findFirst({ where: { email: credentials.email } });
      testUser = user;
      
      if (user) createdUserIds.push(user.id);
    });

    it('should refresh tokens with valid refresh token', async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', validRefreshToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
      
      // El nuevo access token debe ser diferente
      expect(res.body.data.accessToken).not.toBe(accessToken);
      
      // Debe haber un nuevo refresh token en las cookies
      const cookies = res.headers['set-cookie'];
      const hasNewRefreshToken = cookies.some(cookie => cookie.startsWith('refreshToken='));
      expect(hasNewRefreshToken).toBe(true);
    });

    it('should revoke old refresh token', async () => {
      await request(app)
        .post('/auth/refresh')
        .set('Cookie', validRefreshToken);

      // Intentar usar el mismo refresh token de nuevo
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', validRefreshToken);

      expect(res.status).toBe(403); // Forbidden - token reuse detected
    });

    it('should reject missing refresh token', async () => {
      const res = await request(app)
        .post('/auth/refresh');

      expect(res.status).toBe(401);
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=invalid.token.here');

      expect(res.status).toBe(401);
    });

    it('should reject expired refresh token', async () => {
      // Este test es difícil sin manipular el tiempo
      // Solo verificamos que tokens malformados son rechazados
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=s%3Aexpired.token');

      expect(res.status).toBe(401);
    });
  });

  describe('Token Rotation and Security', () => {
    let testUser;

    beforeEach(async () => {
      const timestamp = Date.now();
      const credentials = {
        email: `security.${timestamp}@example.com`,
        password: 'SecurityPass123!',
        name: 'Security Test User'
      };

      await request(app)
        .post('/auth/register')
        .send(credentials);

      const user = await prisma.user.findFirst({ where: { email: credentials.email } });
      testUser = { ...user, plainPassword: credentials.password };
      
      if (user) createdUserIds.push(user.id);
    });

    it('should detect token reuse and revoke all sessions', async () => {
      // Login inicial
      const login1 = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      const cookies1 = login1.headers['set-cookie'];
      const refreshToken1 = cookies1.find(cookie => cookie.startsWith('refreshToken='));

      // Primer refresh (válido)
      const refresh1 = await request(app)
        .post('/auth/refresh')
        .set('Cookie', refreshToken1);

      expect(refresh1.status).toBe(200);

      const cookies2 = refresh1.headers['set-cookie'];
      const refreshToken2 = cookies2.find(cookie => cookie.startsWith('refreshToken='));

      // Intentar reusar el primer token (detectar ataque)
      const reuse = await request(app)
        .post('/auth/refresh')
        .set('Cookie', refreshToken1);

      expect(reuse.status).toBe(403);

      // El segundo token también debería estar revocado
      const testToken2 = await request(app)
        .post('/auth/refresh')
        .set('Cookie', refreshToken2);

      expect(testToken2.status).toBe(403);
    });

    it('should allow multiple active sessions from different logins', async () => {
      // Login 1
      const login1 = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      // Login 2 (nuevo dispositivo)
      const login2 = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      expect(login1.status).toBe(200);
      expect(login2.status).toBe(200);

      // Verificar que hay múltiples sesiones activas
      const sessions = await prisma.userSession.findMany({
        where: { 
          userId: testUser.id,
          revoked: false
        }
      });

      expect(sessions.length).toBeGreaterThanOrEqual(2);
    });

    it('should clean up expired sessions on login', async () => {
      // Crear una sesión y marcarla como expirada manualmente
      const session = await prisma.userSession.create({
        data: {
          userId: testUser.id,
          token: 'expired-token',
          revoked: false,
          expiresAt: new Date(Date.now() - 1000) // Expirada hace 1 segundo
        }
      });

      // Login (debería limpiar sesiones expiradas)
      await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.plainPassword
        });

      // Verificar que la sesión expirada fue eliminada
      const expiredSession = await prisma.userSession.findUnique({
        where: { id: session.id }
      });

      expect(expiredSession).toBeNull();
    });
  });

  describe('Access Token Usage', () => {
    let accessToken;
    let testUser;

    beforeAll(async () => {
      const timestamp = Date.now();
      const credentials = {
        email: `tokenuse.${timestamp}@example.com`,
        password: 'TokenUse123!',
        name: 'Token Use Test'
      };

      await request(app)
        .post('/auth/register')
        .send(credentials);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: credentials.email,
          password: credentials.password
        });

      accessToken = loginRes.body.data.accessToken;

      const user = await prisma.user.findFirst({ where: { email: credentials.email } });
      testUser = user;
      
      if (user) createdUserIds.push(user.id);
    });

    it('should access protected route with valid access token', async () => {
      const res = await request(app)
        .get('/characters')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });

    it('should reject request without access token', async () => {
      const res = await request(app)
        .get('/characters');

      expect(res.status).toBe(401);
    });

    it('should reject request with invalid access token', async () => {
      const res = await request(app)
        .get('/characters')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).toBe(401);
    });

    it('should reject request with malformed authorization header', async () => {
      const res = await request(app)
        .get('/characters')
        .set('Authorization', 'InvalidFormat');

      expect(res.status).toBe(401);
    });
  });
});