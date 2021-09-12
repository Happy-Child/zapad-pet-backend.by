import { Injectable } from '@nestjs/common';
import { UsersCreateDataDTO } from '../dtos/users-create.dtos';
import { UserRepository } from '@app/repositories';
import { UnprocessableEntity } from '@app/exceptions';
import { USERS_ERRORS } from '../constants/errors.constants';
import { ClientRepository } from '../repositories/client.repository';
import { DistrictRepository } from '../repositories/district.repository';
import { checkStationWorkersOrClientMembers } from '../helpers/common.helpers';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly districtRepository: DistrictRepository,
  ) {}

  public async checkUsersEmailsOrFail(emails: string[]): Promise<void> {
    const existingUsers = await this.userRepository.findUsersByEmails(emails);

    if (!existingUsers.length) return;

    throw new UnprocessableEntity(
      existingUsers.map(({ email }) => ({
        value: email,
        field: 'email',
        message: USERS_ERRORS.EMAIL_IS_EXIST,
      })),
    );
  }

  public async checkStationWorkersOrFail(
    stationWorkers: UsersCreateDataDTO[],
  ): Promise<void> {
    const notExistingClientsIds = await checkStationWorkersOrClientMembers({
      fieldName: 'clientId',
      users: stationWorkers,
      repository: this.clientRepository,
    });

    const throwError =
      notExistingClientsIds instanceof Array && notExistingClientsIds.length;

    if (throwError) {
      throw new UnprocessableEntity(
        (notExistingClientsIds as []).map((clientId) => ({
          value: clientId,
          field: 'clientId',
          message: USERS_ERRORS.CLIENT_NOT_EXIST,
        })),
      );
    }
  }

  public async checkClientMembersOrFail(
    clientMembers: UsersCreateDataDTO[],
  ): Promise<void> {
    const notExistingDistrictsIds = await checkStationWorkersOrClientMembers({
      fieldName: 'districtId',
      users: clientMembers,
      repository: this.districtRepository,
    });

    const throwError =
      notExistingDistrictsIds instanceof Array &&
      notExistingDistrictsIds.length;

    if (throwError) {
      throw new UnprocessableEntity(
        (notExistingDistrictsIds as []).map((districtId) => ({
          value: districtId,
          field: 'districtId',
          message: USERS_ERRORS.DISTRICT_NOT_EXIST,
        })),
      );
    }
  }
}
