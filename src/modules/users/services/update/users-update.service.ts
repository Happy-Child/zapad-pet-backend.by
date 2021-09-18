import { Injectable } from '@nestjs/common';
import { UsersCheckBeforeUpdateService } from './users-check-before-update.service';
import { UsersUpdateRequestBodyDTO } from '../../dtos';
import { UsersCheckGeneralDataService } from '../common';
import { getFilteredUsersToUpdate } from '../../helpers';

// Расширенная проверка

// CHECK_CLIENT_ID:
// 1. Если работник станиции привязан в станции - то ошибка

// CHECK_DISTRICT_ID:
// 1. Инжинер. ХЗ
// 2. Руководитель района. ХЗ

// name
// email - needed confirmation
// clientId - :CHECK_CLIENT_ID - STATION_WORKER
// districtId - :CHECK_DISTRICT_ID - CLIENT_MEMBERS

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly usersCheckBeforeUpdateService: UsersCheckBeforeUpdateService,
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
  ) {}

  async update({ users }: UsersUpdateRequestBodyDTO) {
    // ОТФИЛЬТРОВАТЬ ПО МАССИВАМ ЛЮДЕЙ У КОТОРЫХ ИЗМЕНИЛОИСЬ ПОЛЯ
    // EMAIL
    // DISTRICT ID
    // ЧТОБЫ ЕСЛИ У НАС БЫЛ EMAIL "test@mail.ru" И ОН ЛЕТИТ СНОВА - НЕ ПРОВЕРЯТЬ ЕГО НА СУЩ. И НЕ КИДАТЬ ОШИБКУ

    // const emails = users.map(({ email }) => email);
    // await this.checkGeneralUsersDataService.checkUsersEmailsOrFail(emails);

    // DO LOW CODE IF DISTRICT ID WAS CHANGED
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
