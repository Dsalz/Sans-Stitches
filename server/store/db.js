import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
  sendQuery: (queryString, paramsArr) => pool.query(queryString, paramsArr),
};
