// Se verificarán las validaciones
// Se instala otra librería: npm i -D jest
// Agregar otro script en package.json: "test": "jest"

function validarProducto({nombre, precio, stock, marca, categoria, descripcion, sku, imagen, modelo}) {

    // NOMBRE
  if (!nombre || typeof nombre !== 'string') {
    return {ok: false, error: 'Nombre inválido'}
  } // MARCA 
  if (typeof marca !== 'string' || marca === "") {
    return {ok: false, error: 'Marca inválida'}
  } // PRECIO
  const precioNumber = Number(precio);
  if (!Number.isFinite(precioNumber) || precioNumber <= 0) {
    return {ok: false, error: 'Precio inválido'}
  } // STOCK
  const stockNumber = Number(stock);
  if (!Number.isFinite(stockNumber) || stockNumber <= 0) {
    return res.status(400).json({error: 'Stock inválido'})
  } // CATEGORIA
  if (!categoria || typeof categoria !== 'string') {
    return {ok: false, error: 'Categoría inválida'}
  } // DESCRIPCIÓN
  if (!descripcion || typeof descripcion !== 'string') {
    return {ok: false, error: 'Descripción inválida'}
  } // SKU
  if (!sku || typeof sku !== 'string') {
    return {ok: false, error: 'SKU inválido'}
  } // IMAGEN
  if (imagen !== null && typeof imagen !== 'string' || imagen === "") {
    return {ok: false, error: 'URL de imagen inválida'}
  } // MODELO
  if (!modelo || typeof modelo !== 'string') {
    return {ok: false, error: 'Modelo inválido'}
  }

    return {ok: true, data: {nombre, precio: precioNumber, stock: stockNumber, marca, categoria, descripcion, sku, imagen, modelo}};
}

module.exports = {validarProducto}