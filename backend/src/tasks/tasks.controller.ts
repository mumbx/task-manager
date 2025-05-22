import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const tasks = await this.tasksService.findByUserId(Number(userId));

      if (!tasks || tasks.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhuma tarefa encontrada para este usuário.',
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Tarefas encontradas com sucesso.',
        tasks,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao buscar tarefas.',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const removed = await this.tasksService.remove(+id);

      if (!removed) {        
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Tarefa com ID ${id} não encontrada.`,
        });
      }

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao deletar tarefa.',
        error: error.message,
      });
    }
  }
}
