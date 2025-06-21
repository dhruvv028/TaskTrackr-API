const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const Task = require('../../models/Task');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany(); // clear DB after each test
});

describe('Task API', () => {
  it('POST /tasks - should create a task', async () => {
    const res = await request(app).post('/tasks').send({
      title: 'Integration Test',
      description: 'testing API'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Integration Test');
  });

  it('GET /tasks - should return all tasks', async () => {
    await Task.create({ title: 'Sample', description: 'test' });

    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Sample');
  });

  it('PUT /tasks/:id - should update a task', async () => {
    const task = await Task.create({ title: 'Old Title', description: '...' });

    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send({ title: 'Updated Title', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /tasks/:id - should delete a task', async () => {
    const task = await Task.create({ title: 'Delete Me', description: '...' });

    const res = await request(app).delete(`/tasks/${task._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});