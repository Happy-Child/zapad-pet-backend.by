export const PASSWORD_LENGTH = {
  MIN: 8,
  MAX: 20,
};

export const PASSWORD_REGEX = new RegExp(/(?=.*\d)(?=.*[a-zA-Z])/gm);

export const PASSWORD_SALT_ROUNDS = 10;
