import { Pool, QueryArrayConfig, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = async () => {
    await pool.connect();
} 

export const pool = new Pool({
    user: 'scott',
    host: '127.0.0.1',
    database: 'dworom',
    password: 'root',
    port: 5432, // The default port for PostgreSQL is 5432
});

export async function query(text: string, params?: any[]): Promise<any[]> {
    const client = await pool.connect();
    try {
      const result: QueryResult = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }