import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from '@app/auth';

export const comparePasswords = (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

export const getHashByPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};
