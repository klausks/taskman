import * as bcrypt from 'bcrypt';

export const comparePasswords = (
  password: string,
  storedPasswordHash: string,
): Promise<boolean> => bcrypt.compare(password, storedPasswordHash);
