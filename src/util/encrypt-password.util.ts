import * as bcrypt from 'bcrypt';
export const encryptPassword = (password: string): string =>
  bcrypt.hash(password, 12, null);
