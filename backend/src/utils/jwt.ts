import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  } as any);
};
