const Task = require('../../models/Task');

describe('Task Model', () => {
  it('should create a task with title and description', () => {
    const task = new Task({ title: 'Test', description: 'testing' });
    expect(task.title).toBe('Test');
  });
});
