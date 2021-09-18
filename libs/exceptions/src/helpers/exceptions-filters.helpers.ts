export const isValidException = (exception: any): boolean =>
  typeof exception === 'object' &&
  typeof exception !== null &&
  'details' in exception;
