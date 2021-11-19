import { JwtService } from '@nestjs/jwt';
import { FAKE_STATIONS_WORKERS_MAP } from '@app/constants';

export const getTestAccessTokens = (jwtService: JwtService) => ({
  fromStationWorker1: jwtService.sign({
    sub: FAKE_STATIONS_WORKERS_MAP.WORKER_1.id,
  }),
  fromStationWorker7: jwtService.sign({
    sub: FAKE_STATIONS_WORKERS_MAP.WORKER_7.id,
  }),
});
