import { ClientEntity } from '@app/entities';
import { PickType } from '@nestjs/swagger';

export class ClientCreateBodyDTO extends PickType(ClientEntity, ['name']) {}
