const { Pool } = require('pg');
require('dotenv').config();

// pg usará automáticamente la variable DATABASE_URL del archivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a Neon DB');
    client.release();
  } catch (err) {
    console.error('Error al conectar a Neon DB:', err);
  }
};

// Exportamos el 'pool' para poder hacer consultas desde otros archivos
module.exports = {
    pool,
    testConnection
};