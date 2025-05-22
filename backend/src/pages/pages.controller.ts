import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller()
export class PagesController {
    constructor(private jwtService: JwtService, private configService: ConfigService,) { }

    private getUserFromToken(req: Request) {
        const token = req.cookies?.token || '';
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('SECRET'),
            });
            return { id: payload.sub, email: payload.email };
        } catch (err) {
            return null;
        }
    }

    @Get('login')
    showLogin(@Req() req: Request, @Res() res: Response) {
        const user = this.getUserFromToken(req);
        if (user) {
            return res.redirect('/dashboard');
        }
        return res.render('login', { user: null });
    }

    @Get('register')
    showRegister(@Req() req: Request, @Res() res: Response) {
        const user = this.getUserFromToken(req);
        if (user) {
            return res.redirect('/dashboard');
        }
        return res.render('register', { user: null });
    }

    @Get('dashboard')
    showDashboard(@Req() req: Request, @Res() res: Response) {
        const user = this.getUserFromToken(req);
        if (!user) {
            return res.redirect('/login');
        }        
        return res.render('dashboard', { user });
    }
}
