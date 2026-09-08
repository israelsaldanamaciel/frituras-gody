let pedido = [];
let total = 0;
let movimientoProgramado = false;

function moverImagenesConScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    if (movimientoProgramado) {
        return;
    }

    movimientoProgramado = true;
    window.requestAnimationFrame(() => {
        const imagenes = document.querySelectorAll(".producto img");
        const centroVentana = window.innerHeight / 2;

        imagenes.forEach((imagen) => {
            const distanciaAlCentro = imagen.getBoundingClientRect().top + (imagen.offsetHeight / 2) - centroVentana;
            const desplazamiento = Math.max(-14, Math.min(14, distanciaAlCentro * -0.04));

            imagen.style.transform = `translateY(${desplazamiento}px)`;
        });

        movimientoProgramado = false;
    });
}

window.addEventListener("scroll", moverImagenesConScroll, { passive: true });
window.addEventListener("resize", moverImagenesConScroll);
window.addEventListener("load", moverImagenesConScroll);

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

    navigator.clipboard.writeText(mensaje)
        .then(() => {
            alert("El pedido se copió. Pégalo en el chat de Messenger.");
            window.open(enlaceMessenger, "_blank");
        })
        .catch(() => {
            window.open(enlaceMessenger, "_blank");
        });
}