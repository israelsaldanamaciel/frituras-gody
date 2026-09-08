let pedido = [];
let total = 0;

function verProductos() {
    document.getElementById("productos").scrollIntoView({
        behavior: "smooth"
    });
}

function agregarProducto(nombre, precio) {
    pedido.push({
        nombre: nombre,
        precio: precio
    });

    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("listaPedido");

    lista.innerHTML = "";
    total = 0;

    pedido.forEach((producto, index) => {
        total += producto.precio;

        const elemento = document.createElement("p");

        elemento.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="eliminarProducto(${index})">❌</button>
        `;

        lista.appendChild(elemento);
    });

    if (pedido.length === 0) {
        lista.innerHTML = "<p>No has agregado productos todavía.</p>";
    }

    document.getElementById("total").textContent = total;
}

function eliminarProducto(index) {
    pedido.splice(index, 1);
    actualizarCarrito();
}

function copiarMensaje(mensaje) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(mensaje).catch(() => copiarMensajeConRespaldo(mensaje));
    }

    return copiarMensajeConRespaldo(mensaje);
}

function copiarMensajeConRespaldo(mensaje) {
    return new Promise((resolve, reject) => {
        const campoTemporal = document.createElement("textarea");
        campoTemporal.value = mensaje;
        campoTemporal.setAttribute("readonly", "");
        campoTemporal.style.position = "fixed";
        campoTemporal.style.opacity = "0";
        document.body.appendChild(campoTemporal);
        campoTemporal.focus();
        campoTemporal.select();
        campoTemporal.setSelectionRange(0, campoTemporal.value.length);

        try {
            const copiado = document.execCommand("copy");
            document.body.removeChild(campoTemporal);

            if (copiado) {
                resolve();
            } else {
                reject(new Error("No se pudo copiar el pedido"));
            }
        } catch (error) {
            document.body.removeChild(campoTemporal);
            reject(error);
        }
    });
}

function hacerPedido() {
    if (pedido.length === 0) {
        alert("Primero agrega algún producto al pedido.");
        return;
    }

    let mensaje = "🛒 MI PEDIDO\n\n";

    pedido.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - $${producto.precio}\n`;
    });

    mensaje += `\n💰 TOTAL: $${total}`;

    const enlaceMessenger = "https://www.facebook.com/messages/t/61582641410669/";
    const ventanaMessenger = window.open(enlaceMessenger, "_blank");

    copiarMensaje(mensaje)
        .then(() => {
            if (!ventanaMessenger) {
                window.location.assign(enlaceMessenger);
            }
            alert("El pedido se copió. Pégalo en el chat de Messenger.");
        })
        .catch(() => {
            if (ventanaMessenger) {
                alert("Messenger se abrió, pero copia el pedido manualmente:\n\n" + mensaje);
            } else {
                window.location.assign(enlaceMessenger);
                alert("El navegador bloqueó Messenger. Permite las ventanas emergentes y copia este pedido:\n\n" + mensaje);
            }
        });
}