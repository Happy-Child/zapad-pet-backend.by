import moment from 'moment';
import { TIME_SECONDS } from '@app/constants';
import { COUNT_ATTEMPTS_TO_SEND_MESSAGE } from '../constants';

interface CheckTimeAllowedSendMail {
  time: Date;
  attemptCount: number;
}
export const checkTimeAllowedSendMail = ({
  time,
  attemptCount,
}: CheckTimeAllowedSendMail): boolean => {
  if (attemptCount === 0) {
    return true;
  }

  const attemptCountLessDefault = attemptCount < COUNT_ATTEMPTS_TO_SEND_MESSAGE;

  const timeMoreOneMinute =
    moment().diff(time, 'seconds') >= TIME_SECONDS.ONE_MINUTE;
  const timeMore10Minutes =
    moment().diff(time, 'seconds') >= TIME_SECONDS.TEN_MINUTES;

  return attemptCountLessDefault ? timeMoreOneMinute : timeMore10Minutes;
};
