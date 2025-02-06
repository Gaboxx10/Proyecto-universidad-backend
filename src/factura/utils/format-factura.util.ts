export function formatFacturaData(data) {
    // Si el dato es un array, iteramos sobre cada elemento
    if (Array.isArray(data)) {
        // Iteramos sobre cada factura en el array
        data.forEach((item) => {
            formatFactura(item);
        });
    } else {
        // Si es solo un objeto, formateamos directamente
        formatFactura(data);
    }

    return data;
}

// Función auxiliar para formatear una sola factura
function formatFactura(data) {
    // Formateamos los valores de la factura
    data.subtotal = parseFloat(data.subtotal).toFixed(2);
    data.iva = parseFloat(data.iva).toFixed(2);
    data.total_pagar = parseFloat(data.total_pagar).toFixed(2);


    // Formateamos los detalles de la factura
    data.detalles.forEach((detalle) => {
        detalle.precio_unitario = parseFloat(detalle.precio_unitario).toFixed(2);
        detalle.total = parseFloat(detalle.total).toFixed(2);
    });
}
