import { Controller, Post, Body } from '@nestjs/common';
import { IsEmail, IsInt } from 'class-validator';

class ExampleClass {
  @IsInt()
  id: number;

  @IsEmail()
  email: string;
}

@Controller('test')
export class AppController {
  @Post()
  getHello(@Body() body: ExampleClass): string {
    return 'sadf';
  }
}
