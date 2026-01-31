import request from 'supertest';
import app from '../app.js';

describe('Health Check Endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toEqual(200);
  });
});