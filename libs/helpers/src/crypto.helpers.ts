import { randomBytes } from 'crypto';
import { DEFAULT_RANDOM_TOKEN_BYTE_SIZE } from '@app/constants';

export const generateRandomToken = (
  bytes: number = DEFAULT_RANDOM_TOKEN_BYTE_SIZE,
): Promise<string> => {
  return new Promise((resolve) => {
    randomBytes(bytes, (_, result) => resolve(result.toString('hex')));
  });
};
