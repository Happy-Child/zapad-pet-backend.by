import { Injectable } from '@nestjs/common';
import { CheckUsersBeforeUpdateService } from './check-users-before-update.service';
import { UsersUpdateRequestBodyDTO } from '../../dtos/update.dtos';
import { CheckGeneralUsersDataService } from '../common/check-general-users-data.service';
import { getFilteredUsersToUpdate } from '../../helpers/update.helpers';

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly usersCheckBeforeUpdateService: CheckUsersBeforeUpdateService,
    private readonly checkGeneralUsersDataService: CheckGeneralUsersDataService,
  ) {}

  async update({ users }: UsersUpdateRequestBodyDTO) {
    const emails = users.map(({ email }) => email);
    await this.checkGeneralUsersDataService.checkUsersEmailsOrFail(emails);

    const { districtLeaders, engineers, others } =
      getFilteredUsersToUpdate(users);

    if (districtLeaders.length) {
      // DO SOMETHING
    }

    if (engineers.length) {
      // DO SOMETHING
    }

    if (others.length) {
      // DO SOMETHING
    }
  }
}
