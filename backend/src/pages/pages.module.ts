import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    controllers: [PagesController],
})
export class PagesModule { }