import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';

declare module 'express' {
    export interface Request {
      user?: any;
    }
  }

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
  
      // Token is valid, attach the decoded payload to the request object
      req.user = user;
  
      // Proceed to the next middleware or route handler
      next();
    });
  };
  
  export default authenticateToken;