// Instalar npm i pg
// npm install dotenv
// pg permite hacer queries

require('dotenv').config(); // 
const { Pool } = require('pg'); 

if (!process.env.DATABASE_URL) {
    throw new Error('Falta DATABASE_URL en .env')
}

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

module.exports = { pool }        

