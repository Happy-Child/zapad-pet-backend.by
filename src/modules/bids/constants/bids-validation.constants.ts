import moment from 'moment';

export const GET_BID_MIN_DATE_START_OF_DEADLINE = () =>
  moment().add(4, 'days').startOf('day').toDate();
