import * as crypto from'crypto'

export function generateOtp(length:number) {
  const characters = '0123456789';
  const charactersLength = characters.length;
  let otp = '';
  while (otp.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomValue = randomBytes[0];
    if (randomValue < charactersLength) {
        otp += characters[randomValue];
    }
  }
  return Number(otp);
}

