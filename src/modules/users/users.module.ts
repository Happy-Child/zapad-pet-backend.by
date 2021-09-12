import { Module } from '@nestjs/common';
import { UsersCreateService } from './services/users-create.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@app/repositories';
import { ClientRepository } from './repositories/client.repository';
import { DistrictRepository } from './repositories/district.repository';
import { UsersCheckBeforeCreateService } from './services/users-check-before-create.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ClientRepository,
      DistrictRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersCheckBeforeCreateService, UsersCreateService],
})
export class UsersModule {}
