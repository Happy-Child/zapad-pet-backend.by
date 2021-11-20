import { JwtService } from '@nestjs/jwt';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';

export const getTestAccessTokens = (jwtService: JwtService) => ({
  fromStationWorker1: jwtService.sign({
    sub: MOCK_STATIONS_WORKERS_MAP.WORKER_1.id,
  }),
  fromStationWorker7: jwtService.sign({
    sub: MOCK_STATIONS_WORKERS_MAP.WORKER_7.id,
  }),
});
