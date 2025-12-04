import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Photographer from '../models/Photographer';
import Judge from '../models/Judge';

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as JwtPayload;

      // Find user based on role
      if (decoded.role === 'photographer') {
        req.user = await Photographer.findById(decoded.id);
      } else if (decoded.role === 'judge') {
        req.user = await Judge.findById(decoded.id);
      } else if (decoded.role === 'admin') {
        req.user = { _id: decoded.id, role: 'admin' };
      }

      if (!req.user && decoded.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
