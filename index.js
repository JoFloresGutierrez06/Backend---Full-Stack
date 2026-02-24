/* Configuraciones iniciales en consola:
    - npm init
    - npm install express
    ---------------------------------
    - npm install --save-dev nodemon
        *Cambiamos la variable de scripts en package por: "dev": "nodemon index.js"
    - npm run dev 
*/
// npm install cors - nuevo
// npm i cors -permite que el frontend pueda hacer peticiones a este backend sin problemas de CORS (Cross-Origin Resource Sharing)
// npm i jsonwebtoken bcryptjs - nuevo

const express = require('express')
const {pool} = require('./src/db')
const cors = require('cors') // nuevo
const { router: productosRouter } = require('./src/routes/productos.route')
const { router: usersRouter } = require('./src/routes/users.route')
const { sign, authMiddleware } = require('./src/auth')

const PORT = process.env.PORT || 3001 // Si no se define la variable de entorno PORT, se usará el puerto 3001 por defecto
const app = express()

const allowed = [
  'http://localhost:3000', // React
  'http://localhost:3001', // Backend
];

app.use(cors({                    // middleware que se utiliza para habilitar el intercambio de recursos de origen cruzado (CORS) en aplicaciones web.
  origin: function (origin, cb) { // De donde viene la petición.
    if (!origin) {                // No debe haber peticiones de otro lado que no sea nuestro frontend, si no es pública
      return cb(null, true);      // CB manda el menaje. Postman
    } 
    if (allowed.includes(origin)) {
      return cb(null, true);      // el true da luz verde para mandar el mensaje default
    }
    return cb(new Error('CORS bloqueado: ' + origin)); //este es un ejemplo de si se manda un mensaje específico.
  }
}))
app.use(express.json())

app.get('/', (req, res) => { res.send('API OK'); })

app.use('/productos', productosRouter);
app.use('/users', usersRouter);

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email !== 'admin@test.com' || password !== '1234') {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const token = sign({ email, role: 'admin' });

  return res.json({ token});
});

app.get('/privado', authMiddleware, (req, res) => { // no fácilmente accesible, se necesita un token válido para acceder a esta ruta
  return res.json({ 
    ok: true, 
    user: req.user})
})

app.get('health', (req, res) => {
  res.json({ok: true, service:'api'})
})

// app.get('health', async (req, res) => {
//   try {
//     await pool.query('select 1');
//     return res.json({ok: true})
//   } catch (err) {
//     return res.status(500).json({ ok:false })
//   }
// })

app.get('health/db', async (req, res) => {
  try {
    const r = await pool.query('select 1 as ok')
    return res.json({ok: TypeOverrides, db: r.rows[0].ok})
    
  } catch (err) {
    console.log('DB Error', err.message)
    return res.status(500).json({ok:false, error: "DB no disponible"})
  }
})

app.listen(PORT, () => {
  console.log("Servidor Corriendo en puerto", PORT)
})