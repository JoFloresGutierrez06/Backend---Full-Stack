/* const { pool } = require('./src/db');

(async() => { // Es necesario especificar que es una función asíncrona de petición
    const r1 = await pool.query('select 1 as ok'); // Verificar conexión a la base de datos
    console.log('Prueba select 1:', r1.rows)
    
    const r2 = await pool.query(  // Podemos ser selectivos de qué queremos
        'select * from productos;'
        // 'select id,nombre,precio, created_at from productos order by id desc limit 5 offset 5;'
    );  // con offset se hace la paginación

    let buscar = "1; drop table productos" // Por como tenemos
    let nombre = "Teclado"
    let precio = "450"
    
    const r3 = await pool.query(
        `select id,nombre,precio from productos where id = $1 and nombre = $2 or precio = $3`, 
        [buscar, nombre, precio]
        // `select id,nombre,precio from productos where nombre like '%${buscar}%'` Nunca se hace esto. No se insertan directamento
    );
}) (); */

// escribimos en consola: node test-db.js
// Si da un error vamos a la base de datos y nos aseguramos que le método no sea directo, si no pooler y de ip_v4

const { pool } = require('./src/db');

(async () => {  
  // const r1 = await pool.query('select 1 as ok');
  // console.log('Prueba select 1:', r1.rows);

  // const r2 = await pool.query(
  //   'select id, nombre, precio from productos order by id asc limit 5 offset 0;'
  // )
  // console.log(r2.rows)

  let buscar = 1;
  let nombre = 'Teclado';
  let precio = 450;

  const r3 = await pool.query(
    `select id, nombre, precio from productos where id = $1 and nombre = $2 or precio = $3;`,
    [buscar, nombre, precio]
  );

  console.log('resultados:', r3.rows);
})();