let pedido = [];
let total = 0;

function abrirProductosAdicionales() {
    const nuevaPestana = window.open("", "_blank");

    if (!nuevaPestana) {
        alert("Permite las ventanas emergentes para ver estos productos.");
        return;
    }

    nuevaPestana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Más productos | Frituras Gody</title>
            <style>
                body {
                    margin: 0;
                    padding: 32px 18px;
                    color: #783b1b;
                    background: linear-gradient(135deg, #fff8ed, #ffe9c7);
                    font-family: Palatino, "Palatino Linotype", "Book Antiqua", serif;
                    text-align: center;
                }
                h1 { color: #9f3f1e; }
                .productos-extra {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 24px;
                    max-width: 900px;
                    margin: 30px auto;
                }
                .producto-extra {
                    padding: 18px;
                    background: #fff;
                    border: 3px solid #e6a22d;
                    border-radius: 16px;
                    box-shadow: 0 8px 18px rgba(132, 71, 24, 0.22);
                }
                .producto-extra img {
                    width: 100%;
                    height: 300px;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            <h1>Más productos Frituras Gody</h1>
            <div class="productos-extra">
                <article class="producto-extra">
                    <img src="salsas.jpeg" alt="Salsas Frituras Gody">
                    <h2>Salsas</h2>
                    <p>El toque picosito ideal para tus frituras.</p>
                </article>
                <article class="producto-extra">
                    <img src="cueros,patas,chetos.jpeg" alt="Cueros, Patas y Chetos">
                    <h2>Cueros, Patas y Chetos</h2>
                    <p>Una mezcla crujiente y llena de sabor.</p>
                </article>
            </div>
        </body>
        </html>
    `);
    nuevaPestana.document.close();
}

document.querySelectorAll(".producto img").forEach((imagen) => {
    imagen.addEventListener("click", abrirProductosAdicionales);
});

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
            ${producto.nombre}
            <button onclick="eliminarProducto(${index})">❌</button>
        `;

        lista.appendChild(elemento);
    });

    if (pedido.length === 0) {
        lista.innerHTML = "<p>No has agregado productos todavía.</p>";
    }

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

function copiarMensajeSincrono(mensaje) {
    const campoTemporal = document.createElement("textarea");
    campoTemporal.value = mensaje;
    campoTemporal.setAttribute("readonly", "");
    campoTemporal.style.position = "fixed";
    campoTemporal.style.opacity = "0";
    document.body.appendChild(campoTemporal);
    campoTemporal.focus();
    campoTemporal.select();

    let copiado = false;

    try {
        copiado = document.execCommand("copy");
    } finally {
        document.body.removeChild(campoTemporal);
    }

    return copiado;
}

function hacerPedido() {
    if (pedido.length === 0) {
        alert("Primero agrega algún producto al pedido.");
        return;
    }

    let mensaje = "🛒 MI PEDIDO\n\n";

    pedido.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre}\n`;
    });

    const enlaceMessenger = "https://m.me/61582641410669";
    copiarMensajeSincrono(mensaje);
    window.location.assign(enlaceMessenger);
}