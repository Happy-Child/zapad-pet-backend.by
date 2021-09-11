import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommonAuthService, SignUpService } from '@app/auth/services';
import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly commonAuthService: CommonAuthService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() body: SignUpRequestBodyDTO): Promise<true> {
    await this.signUpService.signUp(body);
    return true;
  }

  @Delete('/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<true> {
    await this.commonAuthService.deleteUser(id);
    return true;
  }
}
