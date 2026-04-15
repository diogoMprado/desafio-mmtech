import request from 'supertest';

// Mock Sequelize with in-memory SQLite BEFORE any app imports
jest.mock('../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  return {
    __esModule: true,
    default: new Sequelize('sqlite::memory:', {
      logging: false,
      define: { timestamps: true, underscored: true },
    }),
  };
});

import app from '../src/app';
import sequelize from '../src/config/database';
import Destination from '../src/models/Destination';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Destination.destroy({ where: {}, truncate: true });
});

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/destinations', () => {
  it('should create a destination', async () => {
    const res = await request(app).post('/api/destinations').send({
      name: 'Curitiba',
      latitude: -25.4284,
      longitude: -49.2733,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Curitiba');
    expect(Number(res.body.latitude)).toBeCloseTo(-25.4284);
    expect(Number(res.body.longitude)).toBeCloseTo(-49.2733);
    expect(res.body.sortOrder).toBe(0);
  });

  it('should auto-increment sortOrder', async () => {
    await request(app).post('/api/destinations').send({
      name: 'Curitiba',
      latitude: -25.4284,
      longitude: -49.2733,
    });

    const res = await request(app).post('/api/destinations').send({
      name: 'Ponta Grossa',
      latitude: -25.0945,
      longitude: -50.1633,
    });

    expect(res.status).toBe(201);
    expect(res.body.sortOrder).toBe(1);
  });

  it('should reject missing name', async () => {
    const res = await request(app).post('/api/destinations').send({
      latitude: -25.4284,
      longitude: -49.2733,
    });

    expect(res.status).toBe(400);
  });

  it('should reject invalid latitude', async () => {
    const res = await request(app).post('/api/destinations').send({
      name: 'Inválido',
      latitude: 999,
      longitude: -49.2733,
    });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/destinations', () => {
  it('should list destinations ordered by sortOrder', async () => {
    await Destination.bulkCreate([
      { name: 'Londrina', latitude: -25, longitude: -49, sortOrder: 1 },
      { name: 'Curitiba', latitude: -24, longitude: -48, sortOrder: 0 },
    ]);

    const res = await request(app).get('/api/destinations');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Curitiba');
    expect(res.body[1].name).toBe('Londrina');
  });
});

describe('PUT /api/destinations/:id', () => {
  it('should update a destination', async () => {
    const dest = await Destination.create({
      name: 'Old',
      latitude: -25,
      longitude: -49,
      sortOrder: 0,
    });

    const res = await request(app).put(`/api/destinations/${dest.id}`).send({
      name: 'Updated',
      latitude: -26,
      longitude: -50,
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  it('should return 404 for non-existent destination', async () => {
    const res = await request(app).put('/api/destinations/9999').send({
      name: 'Ghost',
      latitude: -25,
      longitude: -49,
    });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/destinations/:id', () => {
  it('should delete and re-index', async () => {
    const [a, b, c] = await Promise.all([
      Destination.create({ name: 'Curitiba', latitude: -25, longitude: -49, sortOrder: 0 }),
      Destination.create({ name: 'Londrina', latitude: -26, longitude: -50, sortOrder: 1 }),
      Destination.create({ name: 'Maringa', latitude: -27, longitude: -51, sortOrder: 2 }),
    ]);

    await request(app).delete(`/api/destinations/${b.id}`);

    const remaining = await Destination.findAll({ order: [['sortOrder', 'ASC']] });
    expect(remaining).toHaveLength(2);
    expect(remaining[0].name).toBe('Curitiba');
    expect(remaining[0].sortOrder).toBe(0);
    expect(remaining[1].name).toBe('Maringa');
    expect(remaining[1].sortOrder).toBe(1);
  });
});

describe('PUT /api/destinations/reorder', () => {
  it('should reorder destinations', async () => {
    const [a, b] = await Promise.all([
      Destination.create({ name: 'Curitiba', latitude: -25, longitude: -49, sortOrder: 0 }),
      Destination.create({ name: 'Londrina', latitude: -26, longitude: -50, sortOrder: 1 }),
    ]);

    const res = await request(app)
      .put('/api/destinations/reorder')
      .send({ orderedIds: [b.id, a.id] });

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Londrina');
    expect(res.body[1].name).toBe('Curitiba');
  });
});
