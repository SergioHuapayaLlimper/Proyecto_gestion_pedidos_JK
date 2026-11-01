// Logica de negocio (sin DOM) para poder probarla desde Jenkins con Node.
const ESTADOS = ['Pendiente', 'En proceso', 'Entregado'];

function calcularTotal(cantidad, precio) {
  const c = Number(cantidad);
  const p = Number(precio);
  if (!Number.isFinite(c) || !Number.isFinite(p) || c <= 0 || p < 0) {
    throw new Error('Cantidad o precio invalido');
  }
  return Math.round(c * p * 100) / 100;
}

function crearPedido(lista, { cliente, producto, cantidad, precio }) {
  if (!cliente || !String(cliente).trim() || !producto || !String(producto).trim()) {
    throw new Error('Cliente y producto son obligatorios');
  }
  const id = lista.length ? Math.max(...lista.map(p => p.id)) + 1 : 1;
  return {
    id,
    cliente: String(cliente).trim(),
    producto: String(producto).trim(),
    cantidad: Number(cantidad),
    total: calcularTotal(cantidad, precio),
    estado: 'Pendiente'
  };
}

function siguienteEstado(estado) {
  const i = ESTADOS.indexOf(estado);
  if (i === -1) throw new Error('Estado desconocido');
  return ESTADOS[Math.min(i + 1, ESTADOS.length - 1)];
}

function filtrar(lista, estado) {
  return estado === 'Todos' ? lista : lista.filter(p => p.estado === estado);
}

function resumen(lista) {
  return {
    cantidad: lista.length,
    total: Math.round(lista.reduce((s, p) => s + p.total, 0) * 100) / 100,
    pendientes: lista.filter(p => p.estado === 'Pendiente').length
  };
}

const api = { ESTADOS, calcularTotal, crearPedido, siguienteEstado, filtrar, resumen };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else window.Pedidos = api;
