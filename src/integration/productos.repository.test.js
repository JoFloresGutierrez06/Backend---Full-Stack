const { ProductosRepository } = require('../repositories/productos.repository')
const { pool } = require('../db');

describe('Integration: ProductosRepository con DB real', () => {
    const repo =  new ProductosRepository();
    let productoId;

    test('Create guarda en DB real', async () => {
        const created = await repo.create('Gabinete', 2000);
        productoId = created.id // Aqui se guarda el id del producto creado

        expect(created).toBeTruthy() //El elemento existe, es nulo.
        // expect(created).not.toBe(undefined) //casi no se usa
        expect(created.nombre).toBe('Gabinete');
        expect(Number(created.precio)).toBeCloseTo(2000) // Number() a veeeceees se le va a supabase mandar numeros como string. Así te aseguras que sea número
    });

    afterAll(async () => {
    await pool.query('delete from productos where id = $1', [productoId])
    await pool.end();
    })  
});