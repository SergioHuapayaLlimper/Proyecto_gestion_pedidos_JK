const test = require('node:test');
const assert = require('node:assert');
const P = require('../src/pedidos');

test('calcularTotal multiplica y redondea', () => {
  assert.strictEqual(P.calcularTotal(3, 2.5), 7.5);
  assert.strictEqual(P.calcularTotal(3, 0.1), 0.3);
});

test('calcularTotal rechaza valores invalidos', () => {
  assert.throws(() => P.calcularTotal(0, 10));
  assert.throws(() => P.calcularTotal(2, -1));
  assert.throws(() => P.calcularTotal('abc', 1));
});

test('crearPedido asigna id incremental y estado Pendiente', () => {
  const a = P.crearPedido([], { cliente: 'Ana', producto: 'Torta', cantidad: 1, precio: 50 });
  const b = P.crearPedido([a], { cliente: 'Luis', producto: 'Pan', cantidad: 10, precio: 0.5 });
  assert.strictEqual(a.id, 1);
  assert.strictEqual(b.id, 2);
  assert.strictEqual(b.estado, 'Pendiente');
  assert.strictEqual(b.total, 5);
});

test('crearPedido exige cliente y producto', () => {
  assert.throws(() => P.crearPedido([], { cliente: ' ', producto: 'x', cantidad: 1, precio: 1 }));
});

test('siguienteEstado avanza hasta Entregado', () => {
  assert.strictEqual(P.siguienteEstado('Pendiente'), 'En proceso');
  assert.strictEqual(P.siguienteEstado('En proceso'), 'Entregado');
  assert.strictEqual(P.siguienteEstado('Entregado'), 'Entregado');
});

test('filtrar y resumen', () => {
  const l = [
    { id: 1, total: 10, estado: 'Pendiente' },
    { id: 2, total: 20.5, estado: 'Entregado' }
  ];
  assert.strictEqual(P.filtrar(l, 'Todos').length, 2);
  assert.strictEqual(P.filtrar(l, 'Entregado').length, 1);
  assert.deepStrictEqual(P.resumen(l), { cantidad: 2, total: 30.5, pendientes: 1 });
});
