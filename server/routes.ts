import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv';
import authenticateToken from './middleware/auth/AuthenticateToken';
import { pool } from './db';
import { thumbnailCrawler } from './apps/thumbnailCrawler';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const result = await pool.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email",
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
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        // Check if user exists and password is correct
        if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
            // User authenticated successfully

            // Generate JWT token
            const token = jwt.sign(
                { id: user.rows[0].id, username: user.rows[0].username },
                process.env.JWT_SECRET!
            );

            // Send the token
            res.status(200).json({ token, username });
        } else {
            // Authentication failed
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/createthread', async (req: any, res) => {
    try {
        let username;
        let thumbnail = null;

        const { community, title, link, bodyHTML, token } = req.body;
        
        jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
            if (err) {
              return res.status(403).json({ message: 'Failed to authenticate token' });
            }
            else
            {
                username = decoded.username;
            }
          });

        const sanitizedHTML = sanitizeHtml(bodyHTML);

        const communityResult= await pool.query("SELECT id FROM communities WHERE name = $1", [community]);
        const communityInternalId = communityResult.rows[0].id;

        const authorResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
        const authorInternalId = authorResult.rows[0].id;

        if (link) {
            thumbnail = await thumbnailCrawler(link,pool);
        }
        
        const id = await pool.query("INSERT INTO threads (community_id, title, link, body, author_id, thumbnail) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
            [communityInternalId, title, link, sanitizedHTML, authorInternalId, thumbnail]
        );

        if (id) {
            res.status(200);
        } 
        else {
            res.status(401).json({ error: 'Invalid input' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/verifyToken', authenticateToken, (req, res) => {
    res.sendStatus(200);
    
});

router.get('/threads', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1; //  Number of pages we've already loaded
    const limit = 10; // Number of threads per page
    const offset = (page - 1) * limit; // Number of threads we've already loaded

    try {
        const { rows } = await pool.query(`
            SELECT 
                threads.id,
                communities.name AS community_name,
                users.username AS author_username,
                threads.title,
                threads.creation_date,
                threads.link,
                threads.body,
                threads.thumbnail
            FROM
                threads
            JOIN
                communities ON threads.community_id = communities.id
            JOIN
                users ON threads.author_id = users.id
            OFFSET
                $1
            LIMIT
                $2;`,
            [offset, limit]);

        // Convert thumbnail to Base64
        const results = rows.map(row => {
            if (row.thumbnail) {
                const thumbnailBase64 = row.thumbnail.toString('base64');
                return {
                    ...row,
                    thumbnail: `data:image/png;base64,${thumbnailBase64}`
                };
            }
            return row;
        });

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching threads');
    }
});

router.get('/thread/:id', async (req, res) => {
    const thread_id = req.params.id

    try {
        const { rows } = await pool.query(`
            SELECT 
                threads.id,
                communities.name AS community_name,
                users.username AS author_username,
                threads.title,
                threads.creation_date,
                threads.link,
                threads.body,
                threads.thumbnail FROM threads
            JOIN
                communities ON threads.community_id = communities.id
            JOIN
                users ON threads.author_id = users.id
            WHERE threads.id = $1`, 
            [thread_id]);
        
        // Convert thumbnail to Base64
        const results = rows.map(row => {
            if (row.thumbnail) {
                const thumbnailBase64 = row.thumbnail.toString('base64');
                return {
                    ...row,
                    thumbnail: `data:image/png;base64,${thumbnailBase64}`
                };
            }
            return row;
        });
        res.json(results[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching thread');
    }

});

router.post('/submitComment', async (req, res) =>
{
    let username;

    const [threadId, parentCommentId, commentBodyHTML, token] = req.body;
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        else
        {
            username = decoded.username;
        }
      });

    const sanitizedHTML = sanitizeHtml(commentBodyHTML);

    const authorResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    const authorInternalId = authorResult.rows[0].id;

    const communityResult = await pool.query("SELECT community_id FROM threads WHERE id = $1", [threadId])
    const communityInternalId = communityResult.rows[0].community_id;

    try {
        return await pool.query(`
        INSERT INTO comments
            (author_id,
            community_id,
            thread_id,
            parent_comment_id,
            body)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id
        `,
        [authorInternalId, communityInternalId, threadId, parentCommentId, sanitizedHTML]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving comment to the database.');
    }

});

router.get('/thread/:id/comments/:parentId?', async (req, res) => {
    const threadId = req.params.id
    const parentId = req.params.parentId;

    const page = parseInt(req.query.page as string) || 1; //  Number of pages we've already loaded
    const limit = 10; // Number of threads per page
    const offset = (page - 1) * limit; // Number of threads we've already loaded

    try {
        let rows;

        if (parentId) 
        {
            ({rows} = await pool.query(`
            SELECT 
                comments.id,
                users.username AS author_username,
                comments.body,
                comments.creation_date,
                comment_votes.vote_value
            FROM
                comments
            JOIN
                users ON comments.author_id = users.id
            LEFT JOIN
                comment_votes ON comments.id = comment_votes.comment_id AND comments.author_id = comment_votes.user_id
            WHERE
                comments.thread_id = $1
                AND comments.parent_comment_id = $2
            OFFSET
                $3
            LIMIT
                $4;`,
            [threadId, parentId, offset, limit])); 
        }

        else {
            ({rows} = await pool.query(`
                SELECT 
                    comments.id,
                    users.username AS author_username,
                    comments.body,
                    comments.creation_date,
                    comment_votes.vote_value
                FROM
                    comments
                JOIN
                    users ON comments.author_id = users.id
                LEFT JOIN
                    comment_votes ON comments.id = comment_votes.comment_id AND comments.author_id = comment_votes.user_id
                WHERE
                    comments.thread_id = $1
                    AND comments.parent_comment_id IS NULL
                OFFSET
                    $2
                LIMIT
                    $3;`,
                [threadId, offset, limit]));
        }

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching threads');
    }
});

router.post('/thread/:id/like', async (req, res) =>
{
    const thread_id = req.params.id;
    const [ token ] = req.body;
    let username;

    try {  
        jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
            if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
            }

            else
            {
                username = decoded.username;

                const {rows} = await pool.query(`
                INSERT INTO 
                    thread_votes
                        (user_id,
                        thread_id,
                        vote_value)
                VALUES(
                    (SELECT id FROM users WHERE username = $1),
                    $2,
                    1);`,
                [username, thread_id]); 

                res.json(rows[0]);
            }
        });

    } catch (error) {
        res.status(500).send('Error liking thread');
    }
});

router.post('/comment/:id/like', async (req, res) =>
{
    const comment_id = req.params.id;
    const [ token ] = req.body;
    let username;

    try {  
        jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
            if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
            }

            else
            {
                username = decoded.username;

                const {rows} = await pool.query(`
                INSERT INTO 
                    comment_votes
                        (user_id,
                        comment_id,
                        vote_value)
                VALUES(
                    (SELECT id FROM users WHERE username = $1),
                    $2,
                    1);`,
                [username, comment_id]); 

                res.json(rows[0]);
            }
        });

    } catch (error) {
        res.status(500).send('Error liking thread');
    }
});

export default router;