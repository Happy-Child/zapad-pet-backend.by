import { EntityRepository, Repository } from 'typeorm';
import { District } from '../../districts';

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {}
