import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { TaskStatus } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.location = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and return 201', async () => {
      const dto: CreateTaskDto = { title: 'Test', description: 'Desc', userId: 1 };
      const res = mockResponse();

      const mockCreatedTask = { id: 1, ...dto };
      mockTasksService.create.mockResolvedValue(mockCreatedTask);

      await controller.create(dto, res);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.location).toHaveBeenCalledWith('/tasks/1');
      expect(res.json).toHaveBeenCalledWith(mockCreatedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }];
      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockTask = { id: 1, title: 'Task' };
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('findByUserId', () => {
    it('should return tasks for a user', async () => {
      const res = mockResponse();
      const mockTasks = [{ id: 1, userId: 1 }];
      mockTasksService.findByUserId.mockResolvedValue(mockTasks);

      await controller.findByUserId('1', res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tarefas encontradas com sucesso.',
        tasks: mockTasks,
      });
    });

    it('should return 404 if no tasks found', async () => {
      const res = mockResponse();
      mockTasksService.findByUserId.mockResolvedValue([]);

      await controller.findByUserId('1', res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Nenhuma tarefa encontrada para este usuário.',
      });
    });
  });

  describe('update', () => {
    it('should return 200 when task is updated', async () => {
      const res = mockResponse();
      const dto: UpdateTaskDto = { title: 'Updated' };
      mockTasksService.update.mockResolvedValue(true);

      await controller.update('1', dto, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if task not found', async () => {
      const res = mockResponse();
      const dto: UpdateTaskDto = { title: 'Updated' };
      mockTasksService.update.mockResolvedValue(null);

      await controller.update('1', dto, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
    });
  });

  describe('remove', () => {
    it('should return 204 when task is deleted', async () => {
      const res = mockResponse();
      mockTasksService.remove.mockResolvedValue(true);

      await controller.remove('1', res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if task not found', async () => {
      const res = mockResponse();
      mockTasksService.remove.mockResolvedValue(null);

      await controller.remove('1', res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tarefa com ID 1 não encontrada.',
      });
    });
  });
});
