import * as crypto from'crypto'

export function generatePassword(length:number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let password = '';
  while (password.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomValue = randomBytes[0];
    if (randomValue < charactersLength) {
      password += characters[randomValue];
    }
  }
  return password;
}

