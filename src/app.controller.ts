import { Controller, Post, Body } from '@nestjs/common';
import { IsEmail, IsInt } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';

class ExampleClass {
  @IsInt()
  id: number;

  @IsEmail()
  email: string;
}

class ReturnClass {
  @Exclude()
  id: number;

  @Transform(({ value }) => value.toUpperCase())
  email: string;

  constructor(data: Partial<ExampleClass>) {
    Object.assign(this, data);
  }
}

@Controller('test')
export class AppController {
  @Post()
  getHello(@Body() body: ExampleClass): ReturnClass {
    return new ReturnClass(body);
  }
}
