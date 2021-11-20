import { TMemberDTO } from './users-members.types';
import { AccountantDTO, MasterDTO } from '../dtos';

export type TUserDTO = TMemberDTO | AccountantDTO | MasterDTO;
