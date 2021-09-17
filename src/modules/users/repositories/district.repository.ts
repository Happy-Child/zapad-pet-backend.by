import { EntityRepository, Repository } from 'typeorm';
import { District } from 'src/modules/districts';

@EntityRepository(District)
export class DistrictRepository extends Repository<District> {}
