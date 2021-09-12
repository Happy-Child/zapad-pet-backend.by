import { Injectable } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../dtos/users-create.dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { CLIENT_MEMBERS_ROLES, USER_ROLES } from '@app/constants';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
  ) {}

  async create({ users }: UsersCreateRequestBodyDTO) {
    const emails = users.map(({ email }) => email);
    await this.usersCheckBeforeCreateService.checkUsersEmailsOrFail(emails);

    const stationWorkers = users.filter(
      ({ role }) => role === USER_ROLES.STATION_WORKER,
    );
    if (stationWorkers.length) {
      await this.usersCheckBeforeCreateService.checkStationWorkersOrFail(
        stationWorkers,
      );
    }

    const clientMembers = users.filter(({ role }) =>
      CLIENT_MEMBERS_ROLES.includes(role),
    );
    if (clientMembers.length) {
      await this.usersCheckBeforeCreateService.checkClientMembersOrFail(
        clientMembers,
      );
    }
  }
}
