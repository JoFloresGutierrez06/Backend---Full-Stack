// Pruebas para que las validaciones se cumplan
// Para las pruebas de despliegue de DevOps que revisan el código/aplicación para que estén libres de errores, puede ejecutarse el archivo .test y si está todo bien, entonces 

// Ejecutar 'npm test'

const {validarProducto} = require('./productos.rules')

// funcion de la librería jest. se pone qué se quiere probar
test('rechaza nombre vacío', () => {
    const resultado = validarProducto({nombre: '', precio: 100})

    expect(resultado.ok).toBe(false)
})

test('rechaza precio menor a cero', () => {
    const resultado = validarProducto({nombre: 'mouse', precio: -100})

    expect(resultado.ok).toBe(false)
})

test('rechaza precio igual a cero', () => {
    const resultado = validarProducto({nombre: 'mouse', precio: 0})

    expect(resultado.ok).toBe(false)
})

test('convierte precio a string', () => {
    const resultado = validarProducto({nombre: 'mouse', precio: '250'})

    expect(resultado.ok).toBe(true)
    expect(resultado.data.precio).toBe(250)
})

test('rechaza nombre no string', () => {
    const resultado = validarProducto({nombre: 123, precio: 250})

    expect(resultado.ok).toBe(false)
})

test('convierte precio de string a numerico', () => {
  const r = validarProducto({ nombre: 'Mouse', precio: '250' });
  expect(r.ok).toBe(true);
  expect(r.data.precio).toBe(250);
})
