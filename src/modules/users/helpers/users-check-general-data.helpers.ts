import { UserEntity } from '../entities';

export const getPreparingUsersWithDubbedEmail = (
  users: Pick<UserEntity, 'email'>[],
  existingUsers: UserEntity[],
) =>
  existingUsers.map((existingUser) => {
    const index = users.findIndex(({ email }) => email === existingUser.email);
    return { ...existingUser, index };
  });
