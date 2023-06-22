import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv';
import { pool } from './db';
import authenticateToken from './middleware/auth/AuthenticateToken';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const result = await pool.query(
            "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING id, name, email",
            [username, hashedPassword, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Get user from the database
        const user = await pool.query(
            "SELECT * FROM users WHERE name = $1",
            [username]
        );

        // Check if user exists and password is correct
        if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
            // User authenticated successfully

            // Generate JWT token
            const token = jwt.sign(
                { id: user.rows[0].id, username: user.rows[0].name },
                process.env.JWT_SECRET!
            );

            // Send the token
            res.status(200).json({ token });
        } else {
            // Authentication failed
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to verify token
router.get('/verifyToken', authenticateToken, (req, res) => {
    res.sendStatus(200);
    
});

export default router;