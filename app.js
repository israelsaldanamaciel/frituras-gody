let pedido = [];
let total = 0;
const botonInstalar = document.getElementById("instalarApp");

botonInstalar.addEventListener("click", async () => {
    botonInstalar.disabled = true;

    try {
        const respuesta = await fetch("Frituras-Gody.apk");

        if (!respuesta.ok) {
            throw new Error("No se encontró el APK");
        }

        const archivo = await respuesta.blob();
        const enlaceDescarga = document.createElement("a");
        enlaceDescarga.href = URL.createObjectURL(archivo);
        enlaceDescarga.download = "Frituras-Gody.apk";
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        enlaceDescarga.remove();
        URL.revokeObjectURL(enlaceDescarga.href);
    } catch (error) {
        alert("No se pudo descargar el APK. Abre la página con Live Server o HTTPS.");
    } finally {
        botonInstalar.disabled = false;
    }
});

window.addEventListener("load", () => {
    window.setTimeout(() => {
        document.getElementById("portadaCarga").classList.add("oculta");
    }, 5000);
});

function abrirImagen(imagen) {
    const visor = document.createElement("div");
    const imagenAmpliada = document.createElement("img");

    visor.className = "visor-imagen";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-label", "Imagen ampliada");
    imagenAmpliada.src = imagen.src;
    imagenAmpliada.alt = imagen.alt;

    visor.appendChild(imagenAmpliada);
    document.body.appendChild(visor);

    function cerrarImagen() {
        visor.remove();
        document.removeEventListener("keydown", cerrarConEscape);
    }

    function cerrarConEscape(evento) {
        if (evento.key === "Escape") {
            cerrarImagen();
        }
    }

    visor.addEventListener("click", (evento) => {
        if (evento.target === visor) {
            cerrarImagen();
        }
    });
    document.addEventListener("keydown", cerrarConEscape);
}

document.querySelectorAll(".producto img").forEach((imagen) => {
    imagen.addEventListener("click", () => abrirImagen(imagen));
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