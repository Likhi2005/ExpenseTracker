import pg from "pg"
import dotenv from "dotenv"

dotenv.config();

const { Pool } = pg

// export const pool =new Pool({
//     connectionString: process.env.DATABASE_URI,
// })


export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
