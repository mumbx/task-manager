import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class PagesController {

    @Get('login')
    @Render('login')
    showLogin() {
        return {};
    }

    @Get('register')
    @Render('register')
    showRegister() {
        return {};
    }
}
