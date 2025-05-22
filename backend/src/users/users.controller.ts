import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.create(createUserDto);
      const { password, ...userWithoutPassword } = user;

      return res.status(HttpStatus.CREATED).json({
        message: 'Usuário criado com sucesso.',
        user: userWithoutPassword,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'E-mail já cadastrado.',
        });
      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao criar usuário.',
        error: error.message,
      });
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
