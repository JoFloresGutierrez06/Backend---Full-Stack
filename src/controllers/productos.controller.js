// Decide los códigos HTTP
// Valida datos
// Decide errores

const { ProductosRepository } = require('../repositories/productos.repository');
const {validarProducto} = require('../domain/productos.rules') // queda pendiente

const repo = new ProductosRepository();

async function getAll(req, res) {
  const productos = await repo.getAll()
  console.log(productos)
  return res.json(productos)
  // return res.json(repo.getAll())
}

async function getAllActive(req, res) {
  const productos = await repo.getAllActive()
  return res.json(productos)
  // return res.json(repo.getAll())
}

async function getById(req, res) {
  // const productos = await repo.getById()
  const id = Number(req.params.id)
  const producto = await repo.getById(id)

  if (!producto) {
    return res.status(404).json({error: 'Producto no encontrado'})
  }
  return res.json(producto)
}

async function create(req, res) {
  const { nombre, precio, stock, marca = "generico", categoria, descripcion, sku, imagen = null, modelo} = req.body;

  const data = validarProducto({nombre, precio, stock, marca, categoria, descripcion, sku, imagen, modelo});
  
  if (data.error) {
    return res.status(400).json(data.error);
  }

  /* // NOMBRE
  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({error: 'Nombre inválido'})
  } // MARCA 
  if (typeof marca !== 'string' || marca === "") {
    return res.status(400).json({error: 'Marca inválida'})
  } // PRECIO
  const precioNumber = Number(precio);
  if (precio <= 0) {
    return res.status(400).json({error: 'Precio inválido'})
  } // STOCK
  const stockNumber = Number(stock);
  if (stock <= 0) {
    return res.status(400).json({error: 'Stock inválido'})
  } // CATEGORIA
  if (!categoria || typeof categoria !== 'string') {
    return res.status(400).json({error: 'Categoría inválida'})
  } // DESCRIPCIÓN
  if (!descripcion || typeof descripcion !== 'string') {
    return res.status(400).json({error: 'Descripción inválida'})
  } // SKU
  if (!sku || typeof sku !== 'string') {
    return res.status(400).json({error: 'SKU inválido'})
  } // IMAGEN
  if (imagen !== null && typeof imagen !== 'string' || imagen === "") {
    return res.status(400).json({error: 'URL de imagen inválida'})
  } // MODELO
  if (!modelo || typeof modelo !== 'string') {
    return res.status(400).json({error: 'Modelo inválido'})
  }
 */
  /* const data = validarProducto({nombre, precio});
  if (data.error) {
    return res.status(400).json(data.error);
  } */

  // const nuevo = await repo.create(nombre, precioNumber, stockNumber, marca, categoria, descripcion, sku, imagen, modelo)
  const nuevo = await repo.create(data.nombre, data.precioNumber, data.stockNumber, data.marca, data.categoria, data.descripcion, data.sku, data.imagen, data.modelo)
  console.log(nuevo)
  return res.status(201).json(nuevo)
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, precio, stock, marca, categoria, descripcion, sku, imagen, modelo,activo} = req.body;
  
  const producto = {
    nombre: nombre !== undefined ? nombre : undefined, // Operador elvis, es como un if/else reducido.  ?:
    precio: precio !== undefined ? precio : undefined,
    stock: stock !== undefined ? stock : undefined,
    marca: marca !== undefined ? marca : undefined,
    categoria: categoria !== undefined ? categoria : undefined,
    descripcion: descripcion !== undefined ? descripcion : undefined,
    sku: sku !== undefined ? sku : undefined,
    imagen: imagen !== undefined ? imagen : undefined,
    modelo: modelo !== undefined ? modelo : undefined,
    activo: activo !== undefined ? activo : undefined
  }

  //--------- VALIDAR DATOS
  // NOMBRE
  /* if (producto.nombre !== undefined && typeof producto.nombre !== 'string' || producto.nombre === '') {
    return res.status(400).json({error: 'Nombre inválido'})
  } // PRECIO
  if (producto.precio !== undefined && (!Number.isFinite(producto.precio) || producto.precio <= 0)) {
    return res.status(400).json({error: "Precio inválido"})
  } // STOCK
  if (producto.stock !== undefined && (!Number.isFinite(producto.stock) || producto.stock <= 0)) {
    return res.status(400).json({error: "Stock inválido"})
  } // MARCA
  if (producto.marca !== undefined && typeof producto.marca !== 'string' || producto.marca === '') {
    return res.status(400).json({error: 'Marca inválida'})
  } // CATEGORIA
  if (producto.categoria !== undefined && typeof producto.categoria !== 'string' || producto.categoria === '') {
    return res.status(400).json({error: 'Categoria inválida'})
  } // DESCRIPCION
  if (producto.descripcion !== undefined && typeof producto.descripcion !== 'string' || producto.descripcion === '') {
    return res.status(400).json({error: 'Descripcion inválida'})
  } // SKU
  if (producto.sku !== undefined && typeof producto.sku !== 'string' || producto.sku === '' || producto.sku.length !== 6) {
    return res.status(400).json({error: 'SKU inválido'})
  } // IMAGEN
  if (producto.imagen !== undefined && typeof producto.imagen !== 'string' || producto.imagen === '') {
    return res.status(400).json({error: 'URL de imagen inválida'})
  } // MODELO
  if (producto.modelo !== undefined && typeof producto.modelo !== 'string' || producto.modelo === '') {
    return res.status(400).json({error: 'Modelo inválido'})
  } // ACTIVO
  if (producto.activo !== undefined && typeof producto.activo !== 'boolean') {
    return res.status(400).json({error: 'Estado inválido'})
  } */

  if  (producto.precio !== undefined && 
      (!Number.isFinite(producto.precio) || producto.precio <= 0)) 
    { return res.status(400).json({error: "Precio inválido"}) }
    
  if  (producto.stock !== undefined && 
      (!Number.isFinite(producto.stock) || producto.stock <= 0)) 
    { return res.status(400).json({error: "Stock inválido"}) }

  const actualizado = await repo.update(id, producto)

  if (!actualizado) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.json(actualizado)
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const ok = await repo.delete(id)

  if (!ok) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.status(204).send()
}

async function search(req,res) {
  /* const nombre = req.query.nombre; 
  const resultados = await repo.buscar(nombre); */

  const { nombre, minPrecio, maxPrecio, page = 1, limit = 5} = req.query; // Le dejo limit 5 default para que no traiga tantos elementos
  
  // Validar page
  const pageNumber = Number(page)
  if(Number.isNaN(pageNumber) || pageNumber <= 0) {console.log("Entró al condicional de page. Page = "+ pageNumber)
    return res.status(400).json({error: 'Page inválida'})
  } // Validar limit
  const limitNumber = Number(limit)
  if(Number.isNaN(pageNumber) || limitNumber <= 0) { console.log("Entró al condicional de limit. Limit = "+limitNumber)
    return res.status(400).json({error: 'Limit inválido'})
  }
  const parametros = {
    nombre: nombre ?? null,                           // Revisa si hay un elemento, si no lo hay se vuelve null
    minPrecio: minPrecio ? Number(minPrecio) : null,  // Asegurarse que sea un numero
    maxPrecio: maxPrecio ? Number(maxPrecio) : null,  // Asegurarse que sea un numero
    page: page ? Number(page) : null,                 // Asegurarse que sea un numero
    limit: limit ? Number(limit) : null               // Asegurarse que sea un numero
  }
  
  // Buscar productos con filtros y paginación
  const resultados = await repo.buscar(parametros);
  
  if (!resultados.resultados || resultados.resultados.length === 0) {
    return res.status(404).json({error: 'Ningún producto encontrado'})
  }

  return res.json({
    data: resultados.resultados,
    page: parametros.page,
    limit: parametros.limit,
    total: resultados.total
  });

  /* if (!resultados || resultados.length === 0) {
    return res.status(404).json({error: 'Ningún producto encontrado'})
  }
  return res.json(resultados) */
}

module.exports = { getAll, getAllActive, getById, create, update, remove, search }