export function formatPresupuestoData(data) {
  // Si el dato es un array, iteramos sobre cada elemento
  if (Array.isArray(data)) {
    // Iteramos sobre cada presupuesto en el array
    data.forEach((item) => {
      formatPresupuesto(item);
    });
  } else {
    // Si es solo un objeto, formateamos directamente
    formatPresupuesto(data);
  }

  return data;
}

// Función auxiliar para formatear un solo presupuesto
function formatPresupuesto(data) {
  // Formateamos el total_pagar
  data.total_pagar = parseFloat(data.total_pagar).toFixed(2);

  // Formateamos los detalles
  data.detalles.forEach((detalle) => {
    detalle.precio_unitario = parseFloat(detalle.precio_unitario).toFixed(2);
    detalle.importe = parseFloat(detalle.importe).toFixed(2);
  });


}
