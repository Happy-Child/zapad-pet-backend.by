import { Injectable } from '@nestjs/common';
import { AppValidationPipe } from '@app/exceptions/pipes/app-validation.pipe';

@Injectable()
export class UsersCreateValidationPipe extends AppValidationPipe {}
