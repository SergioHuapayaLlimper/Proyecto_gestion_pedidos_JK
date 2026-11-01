// Interfaz: usa window.Pedidos y guarda en localStorage.
(function () {
  const KEY = 'pedidos';
  let pedidos = JSON.parse(localStorage.getItem(KEY) || '[]');

  const $ = id => document.getElementById(id);
  const guardar = () => localStorage.setItem(KEY, JSON.stringify(pedidos));

  function pintar() {
    const lista = Pedidos.filtrar(pedidos, $('filtro').value);
    $('tabla').innerHTML = lista.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${esc(p.cliente)}</td>
        <td>${esc(p.producto)}</td>
        <td>${p.cantidad}</td>
        <td>S/ ${p.total.toFixed(2)}</td>
        <td><span class="estado-${p.estado.split(' ')[0]}">${p.estado}</span></td>
        <td>
          <button data-avanzar="${p.id}">Avanzar</button>
          <button class="borrar" data-borrar="${p.id}">X</button>
        </td>
      </tr>`).join('');
    $('vacio').style.display = lista.length ? 'none' : 'block';
    const r = Pedidos.resumen(pedidos);
    $('resumen').textContent = `${r.cantidad} pedidos | ${r.pendientes} pendientes | Total S/ ${r.total.toFixed(2)}`;
  }

  function esc(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  $('form-pedido').addEventListener('submit', e => {
    e.preventDefault();
    try {
      pedidos.push(Pedidos.crearPedido(pedidos, {
        cliente: $('cliente').value,
        producto: $('producto').value,
        cantidad: $('cantidad').value,
        precio: $('precio').value
      }));
      guardar();
      e.target.reset();
      pintar();
    } catch (err) {
      alert(err.message);
    }
  });

  $('tabla').addEventListener('click', e => {
    const a = e.target.dataset.avanzar;
    const b = e.target.dataset.borrar;
    if (a) {
      const p = pedidos.find(x => x.id === Number(a));
      p.estado = Pedidos.siguienteEstado(p.estado);
    }
    if (b) pedidos = pedidos.filter(x => x.id !== Number(b));
    if (a || b) { guardar(); pintar(); }
  });

  $('filtro').addEventListener('change', pintar);
  pintar();
})();
