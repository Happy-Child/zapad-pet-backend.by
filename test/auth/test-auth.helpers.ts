import { JwtService } from '@nestjs/jwt';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';
import { getTestAccessToken } from '../test.helpers';

export const getTestAuthAccessTokens = (jwtService: JwtService) => ({
  fromStationWorker1: getTestAccessToken(
    jwtService,
    MOCK_STATIONS_WORKERS_MAP.WORKER_1.id!,
  ),
  fromStationWorker7: getTestAccessToken(
    jwtService,
    MOCK_STATIONS_WORKERS_MAP.WORKER_7.id!,
  ),
});
