import { Injectable } from '@nestjs/common';
import { ExceptionsAppValidationPipe } from '@app/exceptions/pipes/exceptions-app-validation.pipe';

@Injectable()
export class UsersCreateValidationPipe extends ExceptionsAppValidationPipe {}
