const {pool} = require('../db');

class ProductosRepository {
  /* constructor() {
    this.productos = [];
    this.nextId = 1;
  } */

  async getAll() {
    const result = await pool.query(
      'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos order by id asc;'
    );
    return result.rows;
    // return this.productos;
  }
  
  async getAllActive() {
    const result = await pool.query(
      'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where activo = true order by id asc;'
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];
    // return this.productos.find(producto => producto.id === id);
  }

  async create(nombre, precio, stock, marca, categoria, descripcion, sku, imagen, modelo) {
    /*  const newProducto = { id: this.nextId++, nombre, precio };
     this.productos.push(newProducto);
     return newProducto; */
    // Se le asigna un valor true a activo, por default al momento de crear el producto nuevo

    const result = await pool.query(
      'insert into productos (nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) returning id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo', 
      [nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo]
    );
    return result.rows[0];
  }

  async update(id, data) {
    /* const producto = this.getById(id);
    if (producto) {
      producto.nombre = data.nombre;
      producto.precio = data.precio;
      return producto;
      }
      return null; */

      const result = await pool.query(    // coalesce() si algo está nulo no lo actualiza
        'update productos set nombre=coalesce($1,nombre), precio=coalesce($2,precio), stock=coalesce($3,stock), marca=coalesce($4,marca), categoria=coalesce($5,categoria), descripcion=coalesce($6,descripcion), sku=coalesce($7,sku), imagen=coalesce($8,imagen), modelo=coalesce($9,modelo), activo=coalesce($10,activo) where id = $11 returning id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo', 
        [data.nombre ?? null, 
         data.precio ?? null, 
         data.stock ?? null, 
         data.marca ?? null, 
         data.categoria ?? null, 
         data.descripcion ?? null, 
         data.sku ?? null, 
         data.imagen ?? null, 
         data.modelo ?? null, 
         data.activo ?? null, 
         id]                              // El ?? verifica si hay un elemento, si no hay, se vuelve nulo. 
      );
      return result.rows[0] || null;      // con .rows[0] se devuelve únicamente un elemento json 
  }

  async delete(id) {
    /* const index = this.productos.findIndex(producto => producto.id === id);
    if (index !== -1) {
      return this.productos.splice(index, 1)[0];
    }
    return null; */

    const result = await pool.query(
      'delete from productos where id = $1 returning id', 
      [id]                                // no se pone la variable directamente para evitar inyecciones SQL
    );
    return result.rows[0] || null;
  }

  // async buscar({nombre, minPrecio, maxPrecio, page, limit}) {
  //   /* const result = await pool.query(
  //     'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre like $1 order by id desc limit 5', [`%${nombre}`]
  //   ) */
  //   const offset = (page - 1) * limit;

  //   if (nombre && minPrecio && maxPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre ilike $1 and precio between $2 and $3 order by id desc limit $4 offset $5', [`%${nombre}%`,minPrecio, maxPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where nombre ilike $1 and precio between $2 and $3', [`%${nombre}%`,minPrecio, maxPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //   } 
  //   else if (nombre && minPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre ilike $1 and precio >= $2 order by id desc limit $3 offset $4', [`%${nombre}%`,minPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where nombre ilike $1 and precio >= $2', [`%${nombre}%`,minPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }
  //   else if (nombre && maxPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre ilike $1 and precio <= $2 order by id desc limit $3 offset $4', [`%${nombre}%`,maxPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where nombre ilike $1 and precio <= $2', [`%${nombre}%`,maxPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }
  //   else if (nombre) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre ilike $1 order by id desc limit $2 offset $3', [`%${nombre}%`, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where nombre ilike $1', [`%${nombre}%`]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }
  //   else if (minPrecio && maxPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where precio between $1 and $2 order by id desc limit $3 offset $4', [minPrecio, maxPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where precio between $1 and $2', [minPrecio, maxPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }
  //   else if (minPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where precio >= $1 order by id desc limit $2 offset $3', [minPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where precio >= $1', [minPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }
  //   else if (maxPrecio) {
  //     const result = await pool.query(
  //       'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where precio <= $1 order by id desc limit $2 offset $3', [maxPrecio, limit, offset]
  //     )
  //     const contar = await pool.query(
  //       'select count(*) from productos where precio <= $1', [maxPrecio]
  //     )
  //     const total = Number(contar.rows[0].count)
  //     return {resultados: result.rows, total}
  //     // return result.rows;
  //   }

  //   /* const result = await pool.query(
  //     'select id,nombre,precio,stock,marca,categoria,descripcion,sku,imagen,modelo,activo from productos where nombre ilike $1 order by id desc limit $2 offset', [`%${nombre}%`]
  //   )
  //   return result.rows; */
  // }

  async buscar(data) {
    const result = await pool.query(
      'select id, nombre, precio from productos where nombre like coalesce($1, nombre) or precio = coalesce($2, precio) and activo = true',[`%${data.nombre}%`, data.precio]
    )
    return result.rows;
  }

}

module.exports = { ProductosRepository }