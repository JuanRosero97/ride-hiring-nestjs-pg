import * as bcrypt from 'bcrypt';

export async function comparePassword(
  passwordStored: string,
  passwordInserted: string,
) {
  return await bcrypt.compare(passwordInserted, passwordStored);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
