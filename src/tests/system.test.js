import request from 'supertest';
import app from '../app.js';

describe('System & Monitoring: Integration Tests', () => {

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /metrics', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toEqual(200);
      if (res.headers['content-type']?.includes('json')) expect(res.body).toBeDefined();
    });
  });
});