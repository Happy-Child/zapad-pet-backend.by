import { EntityRepository } from 'typeorm';
import { DistrictEntity } from '../../districts';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictEntity)
export class UsersDistrictsRepository extends GeneralRepository<DistrictEntity> {}
