import { EntityRepository, Repository } from 'typeorm';
import { District } from '@app/entities';

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {}
