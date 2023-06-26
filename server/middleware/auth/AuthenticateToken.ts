import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Extract the token from the header
  
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
      });
    }
  };
  
  export default authenticateToken;