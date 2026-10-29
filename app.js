"use strict";

/* ==========================================
   ÑE'ERYRU TECNOLÓGICO
   Primera versión funcional de demostración
========================================== */

const CLAVES = {
    libros: "neeryru_libros_v1",
    prestamos: "neeryru_prestamos_v1"
};

const CATEGORIAS = [
    { nombre: "Cuentos", icono: "📕", color: "#a76548" },
    { nombre: "Novelas", icono: "📚", color: "#526b60" },
    { nombre: "Poesía", icono: "🌷", color: "#a76b72" },
    { nombre: "Teatro", icono: "🎭", color: "#685477" },
    { nombre: "Ensayo", icono: "✒️", color: "#8b704f" },
    { nombre: "Diccionarios", icono: "📖", color: "#637d88" },
    { nombre: "Historia", icono: "🏛️", color: "#8a694c" },
    { nombre: "Ciencias", icono: "🔬", color: "#62806a" },
    { nombre: "Otros", icono: "📘", color: "#81705e" }
];


/* LIBROS FICTICIOS PARA PROBAR EL SISTEMA */

const LIBROS_INICIALES = [
    {
        id: "LIB-001",
        titulo: "El principito",
        autor: "Antoine de Saint-Exupéry",
        categoria: "Novelas",
        materia: "Literatura",
        ubicacion: "Estante A - Ejemplo",
        cantidad: 3,
        perdidos: 0,
        descripcion: "Obra literaria.",
        color: "#8b6c4f",
        simbolo: "✦"
    },
    {
        id: "LIB-002",
        titulo: "Don Quijote de la Mancha",
        autor: "Miguel de Cervantes",
        categoria: "Novelas",
        materia: "Lengua Castellana",
        ubicacion: "Estante A - Ejemplo",
        cantidad: 2,
        perdidos: 0,
        descripcion: "Novela clásica.",
        color: "#63775f",
        simbolo: "DQ"
    },
    {
        id: "LIB-003",
        titulo: "Cuentos de ejemplo",
        autor: "Autor de ejemplo",
        categoria: "Cuentos",
        materia: "Literatura",
        ubicacion: "Estante B - Ejemplo",
        cantidad: 4,
        perdidos: 0,
        descripcion: "Colección ilustrativa.",
        color: "#a76548",
        simbolo: "✧"
    },
    {
        id: "LIB-004",
        titulo: "Poemas seleccionados",
        autor: "Autor de ejemplo",
        categoria: "Poesía",
        materia: "Literatura",
        ubicacion: "Estante C - Ejemplo",
        cantidad: 2,
        perdidos: 0,
        descripcion: "Selección de poesía.",
        color: "#a76b72",
        simbolo: "❝"
    },
    {
        id: "LIB-005",
        titulo: "Obras de teatro",
        autor: "Autor de ejemplo",
        categoria: "Teatro",
        materia: "Arte y Literatura",
        ubicacion: "Estante D - Ejemplo",
        cantidad: 3,
        perdidos: 0,
        descripcion: "Textos teatrales.",
        color: "#685477",
        simbolo: "✦"
    },
    {
        id: "LIB-006",
        titulo: "Introducción a las ciencias",
        autor: "Autor de ejemplo",
        categoria: "Ciencias",
        materia: "Ciencias Naturales",
        ubicacion: "Estante E - Ejemplo",
        cantidad: 3,
        perdidos: 0,
        descripcion: "Material educativo.",
        color: "#62806a",
        simbolo: "⚛"
    },
    {
        id: "LIB-007",
        titulo: "Diccionario escolar",
        autor: "Editorial de ejemplo",
        categoria: "Diccionarios",
        materia: "Lengua Castellana",
        ubicacion: "Estante F - Ejemplo",
        cantidad: 5,
        perdidos: 0,
        descripcion: "Material de consulta.",
        color: "#637d88",
        simbolo: "Aa"
    },
    {
        id: "LIB-008",
        titulo: "Historia universal",
        autor: "Autor de ejemplo",
        categoria: "Historia",
        materia: "Historia",
        ubicacion: "Estante G - Ejemplo",
        cantidad: 2,
        perdidos: 0,
        descripcion: "Material histórico.",
        color: "#8a694c",
        simbolo: "⌂"
    }
];


/* ELEMENTOS DEL DOCUMENTO */

const $ = (selector) => document.querySelector(selector);

const vistas = document.querySelectorAll(".view");
const botonesNavegacion = document.querySelectorAll("[data-view]");

let temporizadorMensaje;


/* ALMACENAMIENTO LOCAL */

function leerAlmacenamiento(clave, alternativa) {
    try {
        const dato = localStorage.getItem(clave);

        if (dato === null) {
            return alternativa;
        }

        const resultado = JSON.parse(dato);

        return Array.isArray(resultado) ? resultado : alternativa;

    } catch (error) {
        console.error("No se pudo leer el almacenamiento:", error);
        return alternativa;
    }
}

function guardarAlmacenamiento(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;

    } catch (error) {
        console.error("No se pudo guardar la información:", error);

        mostrarMensaje(
            "No se pudo guardar la información. Comprueba el almacenamiento del navegador."
        );

        return false;
    }
}


let libros = leerAlmacenamiento(CLAVES.libros, null);
let prestamos = leerAlmacenamiento(CLAVES.prestamos, []);

if (libros === null) {
    libros = LIBROS_INICIALES.map(libro => ({ ...libro }));
    guardarAlmacenamiento(CLAVES.libros, libros);
}


/* UTILIDADES */

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caracter];
    });
}

function obtenerCategoria(nombre) {
    return CATEGORIAS.find(
        categoria => categoria.nombre === nombre
    ) || CATEGORIAS[CATEGORIAS.length - 1];
}

function fechaLocal(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function formatearFecha(fecha) {
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return "—";
    }

    const [anio, mes, dia] = fecha.split("-");

    return `${dia}/${mes}/${anio}`;
}

function esFechaValida(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaComprobada = new Date(anio, mes - 1, dia);

    return (
        fechaComprobada.getFullYear() === anio &&
        fechaComprobada.getMonth() === mes - 1 &&
        fechaComprobada.getDate() === dia
    );
}

function crearId(prefijo) {
    return `${prefijo}-${Date.now()}-${Math.random()
        .toString(36).slice(2, 8)}`;
}

function mostrarMensaje(texto) {
    const mensaje = $("#mensaje");

    mensaje.textContent = texto;
    mensaje.classList.remove("hidden");

    clearTimeout(temporizadorMensaje);

    temporizadorMensaje = setTimeout(() => {
        mensaje.classList.add("hidden");
    }, 4000);
}


/* NAVEGACIÓN */

function abrirVista(nombre) {
    const vista = $(`#vista-${nombre}`);

    if (!vista) {
        return;
    }

    vistas.forEach(elemento => {
        elemento.classList.toggle("active", elemento === vista);
    });

    botonesNavegacion.forEach(boton => {
        boton.classList.toggle(
            "active",
            boton.dataset.view === nombre &&
            boton.classList.contains("nav-button")
        );
    });

    const titulos = {
        inicio: "Inicio",
        catalogo: "Catálogo",
        categorias: "Categorías",
        prestamos: "Préstamos",
        vencidos: "Préstamos vencidos",
        historial: "Historial",
        administracion: "Administración"
    };

    $("#nombreSeccion").textContent = titulos[nombre] || "Biblioteca";

    if (nombre === "catalogo") {
        renderizarCatalogo();
    }

    if (nombre === "categorias") {
        renderizarTodasCategorias();
    }

    if (nombre === "prestamos") {
        renderizarPrestamos();
    }

    if (nombre === "vencidos") {
        renderizarVencidos();
    }

    if (nombre === "historial") {
        renderizarHistorial();
    }

    if (nombre === "administracion") {
        renderizarAdministracion();
    }

    if (nombre === "inicio") {
        renderizarInicio();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

botonesNavegacion.forEach(boton => {
    boton.addEventListener("click", () => {
        abrirVista(boton.dataset.view);
    });
});


/* DISPONIBILIDAD */

function prestamosActivosDelLibro(libroId) {
    return prestamos.filter(prestamo =>
        prestamo.libroId === libroId &&
        prestamo.estado === "prestado"
    ).length;
}

function ejemplaresDisponibles(libro) {
    const prestados = prestamosActivosDelLibro(libro.id);

    return Math.max(
        0,
        Number(libro.cantidad) -
        Number(libro.perdidos || 0) -
        prestados
    );
}

function prestamoEstaVencido(prestamo) {
    return (
        prestamo.estado === "prestado" &&
        esFechaValida(prestamo.fechaDevolucion) &&
        prestamo.fechaDevolucion < fechaLocal()
    );
}

function obtenerEstado(prestamo) {
    if (prestamo.estado === "devuelto") {
        return "Devuelto";
    }

    if (prestamo.estado === "extraviado") {
        return "Extraviado";
    }

    if (prestamoEstaVencido(prestamo)) {
        return "Vencido";
    }

    return "Prestado";
}

function guardarLibros() {
    return guardarAlmacenamiento(CLAVES.libros, libros);
}

function guardarPrestamos() {
    return guardarAlmacenamiento(CLAVES.prestamos, prestamos);
}


/* PORTADAS */

function crearPortada(libro) {
    return `
        <div
            class="book-cover"
            style="background-color:${escaparHTML(libro.color || "#795744")}"
            aria-label="Ilustración de portada"
        >
            <div class="cover-symbol">
                ${escaparHTML(libro.simbolo || "📖")}
            </div>
        </div>
    `;
}


/* TARJETAS DE LIBROS */

function crearTarjetaLibro(libro) {
    const disponibles = ejemplaresDisponibles(libro);
    const categoria = obtenerCategoria(libro.categoria);

    return `
        <article class="book-card">

            ${crearPortada(libro)}

            <div class="book-card-body">

                <span class="book-category">
                    ${escaparHTML(categoria.nombre)}
                </span>

                <h3>${escaparHTML(libro.titulo)}</h3>

                <p class="book-author">
                    ${escaparHTML(libro.autor)}
                </p>

                <p class="book-location">
                    📍 ${escaparHTML(libro.ubicacion || "Ubicación pendiente")}
                </p>

                <div class="book-footer">

                    <span class="availability ${
                        disponibles > 0 ? "available" : "unavailable"
                    }">
                        ${disponibles > 0
                            ? `${disponibles} disponible(s)`
                            : "No disponible"}
                    </span>

                    <button
                        class="small-button"
                        data-prestar="${escaparHTML(libro.id)}"
                        ${disponibles === 0 ? "disabled" : ""}
                    >
                        Prestar
                    </button>

                </div>

            </div>
        </article>
    `;
}


/* CATEGORÍAS */

function crearTarjetaCategoria(categoria) {
    const cantidad = libros
        .filter(libro => libro.categoria === categoria.nombre)
        .reduce((total, libro) => total + Number(libro.cantidad || 0), 0);

    return `
        <button
            class="category-card"
            data-categoria="${escaparHTML(categoria.nombre)}"
        >
            <span class="category-icon">
                ${escaparHTML(categoria.icono)}
            </span>

            <span>
                <strong>${escaparHTML(categoria.nombre)}</strong>
                <small>${cantidad} ejemplar(es) registrados</small>
            </span>
        </button>
    `;
}

function renderizarCategoriasInicio() {
    $("#categoriasInicio").innerHTML = CATEGORIAS
        .slice(0, 6)
        .map(crearTarjetaCategoria)
        .join("");
}

function renderizarTodasCategorias() {
    $("#todasLasCategorias").innerHTML = CATEGORIAS
        .map(crearTarjetaCategoria)
        .join("");
}


/* INICIO */

function renderizarInicio() {
    const total = libros.reduce(
        (suma, libro) => suma + Number(libro.cantidad || 0),
        0
    );

    const disponibles = libros.reduce(
        (suma, libro) => suma + ejemplaresDisponibles(libro),
        0
    );

    const activos = prestamos.filter(
        prestamo => prestamo.estado === "prestado"
    ).length;

    const vencidos = prestamos.filter(prestamoEstaVencido).length;

    $("#totalLibros").textContent = total;
    $("#totalDisponibles").textContent = disponibles;
    $("#totalPrestados").textContent = activos;
    $("#totalVencidos").textContent = vencidos;
    $("#contadorVencidos").textContent = vencidos;

    renderizarCategoriasInicio();

    $("#librosInicio").innerHTML = libros
        .slice(0, 4)
        .map(crearTarjetaLibro)
        .join("");
}


/* CATÁLOGO */

function actualizarOpcionesCategorias() {
    const selectores = [
        $("#filtroCategoria"),
        $("#nuevaCategoria")
    ];

    selectores.forEach((selector, indice) => {
        const valorActual = selector.value;

        const primeraOpcion = indice === 0
            ? '<option value="">Todas las categorías</option>'
            : '<option value="">Seleccionar</option>';

        selector.innerHTML = primeraOpcion +
            CATEGORIAS.map(categoria => `
                <option value="${escaparHTML(categoria.nombre)}">
                    ${escaparHTML(categoria.nombre)}
                </option>
            `).join("");

        if (
            [...selector.options].some(
                opcion => opcion.value === valorActual
            )
        ) {
            selector.value = valorActual;
        }
    });
}

function renderizarCatalogo() {
    const texto = $("#buscador").value
        .trim()
        .toLocaleLowerCase("es");

    const categoria = $("#filtroCategoria").value;
    const disponibilidad = $("#filtroDisponibilidad").value;

    const filtrados = libros.filter(libro => {
        const textoLibro = [
            libro.titulo,
            libro.autor,
            libro.categoria,
            libro.materia,
            libro.id
        ].join(" ").toLocaleLowerCase("es");

        const coincideTexto = textoLibro.includes(texto);

        const coincideCategoria = !categoria ||
            libro.categoria === categoria;

        const disponibles = ejemplaresDisponibles(libro);

        const coincideDisponibilidad =
            !disponibilidad ||
            (disponibilidad === "disponible" && disponibles > 0) ||
            (disponibilidad === "prestado" && disponibles === 0);

        return coincideTexto &&
            coincideCategoria &&
            coincideDisponibilidad;
    });

    $("#catalogoLibros").innerHTML = filtrados
        .map(crearTarjetaLibro)
        .join("");

    $("#cantidadResultados").textContent =
        `${filtrados.length} libro(s)`;

    $("#catalogoVacio").classList.toggle(
        "hidden",
        filtrados.length !== 0
    );
}

$("#buscador").addEventListener("input", renderizarCatalogo);
$("#filtroCategoria").addEventListener("change", renderizarCatalogo);
$("#filtroDisponibilidad").addEventListener("change", renderizarCatalogo);

$("#limpiarBusqueda").addEventListener("click", () => {
    $("#buscador").value = "";
    $("#filtroCategoria").value = "";
    $("#filtroDisponibilidad").value = "";

    renderizarCatalogo();
});


/* ABRIR EL CATÁLOGO DESDE UNA CATEGORÍA */

document.addEventListener("click", evento => {
    const botonCategoria = evento.target.closest("[data-categoria]");

    if (botonCategoria) {
        abrirVista("catalogo");

        $("#buscador").value = "";
        $("#filtroDisponibilidad").value = "";
        $("#filtroCategoria").value =
            botonCategoria.dataset.categoria;

        renderizarCatalogo();
        return;
    }

    const botonPrestar = evento.target.closest("[data-prestar]");

    if (botonPrestar) {
        const libro = libros.find(
            elemento => elemento.id === botonPrestar.dataset.prestar
        );

        if (!libro || ejemplaresDisponibles(libro) < 1) {
            mostrarMensaje("Este libro no tiene ejemplares disponibles.");
            return;
        }

        abrirVista("prestamos");
        $("#libroPrestamo").value = libro.id;
        $("#alumno").focus();
    }
});


/* SELECTOR DE LIBROS PARA PRÉSTAMOS */

function actualizarSelectorLibros() {
    const selector = $("#libroPrestamo");
    const seleccionado = selector.value;

    const disponibles = libros.filter(
        libro => ejemplaresDisponibles(libro) > 0
    );

    selector.innerHTML =
        '<option value="">Selecciona un libro</option>' +
        disponibles.map(libro => `
            <option value="${escaparHTML(libro.id)}">
                ${escaparHTML(libro.titulo)}
                (${ejemplaresDisponibles(libro)} disponible(s))
            </option>
        `).join("");

    if (disponibles.some(libro => libro.id === seleccionado)) {
        selector.value = seleccionado;
    }
}


/* REGISTRAR PRÉSTAMOS */

$("#fechaPrestamo").value = fechaLocal();

$("#fechaPrestamo").addEventListener("change", () => {
    $("#fechaDevolucion").min = $("#fechaPrestamo").value;
});

$("#formularioPrestamo").addEventListener("submit", evento => {
    evento.preventDefault();

    const alumno = $("#alumno").value.trim();
    const curso = $("#curso").value.trim();
    const libroId = $("#libroPrestamo").value;
    const fechaPrestamo = $("#fechaPrestamo").value;
    const fechaDevolucion = $("#fechaDevolucion").value;

    if (!alumno || !curso || !libroId) {
        mostrarMensaje("Completa todos los campos obligatorios.");
        return;
    }

    if (
        !esFechaValida(fechaPrestamo) ||
        !esFechaValida(fechaDevolucion)
    ) {
        mostrarMensaje("Introduce fechas válidas.");
        return;
    }

    if (fechaDevolucion < fechaPrestamo) {
        mostrarMensaje(
            "La devolución no puede tener una fecha anterior al préstamo."
        );
        return;
    }

    const libro = libros.find(elemento => elemento.id === libroId);

    if (!libro || ejemplaresDisponibles(libro) < 1) {
        mostrarMensaje("No quedan ejemplares disponibles de ese libro.");
        return;
    }

    const prestamo = {
        id: crearId("PRE"),
        alumno,
        curso,
        libroId,
        tituloLibro: libro.titulo,
        fechaPrestamo,
        fechaDevolucion,
        estado: "prestado",
        fechaDevolucionReal: null
    };

    prestamos.push(prestamo);

    if (!guardarPrestamos()) {
        prestamos.pop();
        return;
    }

    $("#formularioPrestamo").reset();
    $("#fechaPrestamo").value = fechaLocal();
    $("#fechaDevolucion").value = "";
    $("#fechaDevolucion").min = fechaLocal();

    actualizarTodo();
    mostrarMensaje("Préstamo registrado correctamente.");

    abrirVista("prestamos");
});


/* TABLAS DE PRÉSTAMOS */

function crearEstado(prestamo) {
    const estado = obtenerEstado(prestamo);

    const clases = {
        "Prestado": "state-active",
        "Vencido": "state-overdue",
        "Devuelto": "state-returned",
        "Extraviado": "state-lost"
    };

    return `
        <span class="state-pill ${clases[estado]}">
            ${estado}
        </span>
    `;
}

function tablaVacia(mensaje) {
    return `
        <div class="empty-state">
            <strong>Todo en orden</strong>
            ${escaparHTML(mensaje)}
        </div>
    `;
}

function crearTablaPrestamos(lista, mostrarAcciones = false) {
    if (lista.length === 0) {
        return tablaVacia("No hay registros para mostrar.");
    }

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Alumno</th>
                    <th>Curso</th>
                    <th>Libro</th>
                    <th>Préstamo</th>
                    <th>Devolución prevista</th>
                    <th>Estado</th>
                    ${mostrarAcciones ? "<th>Acciones</th>" : ""}
                </tr>
            </thead>

            <tbody>
                ${lista.map(prestamo => `
                    <tr>
                        <td>${escaparHTML(prestamo.alumno)}</td>
                        <td>${escaparHTML(prestamo.curso)}</td>
                        <td>${escaparHTML(prestamo.tituloLibro)}</td>
                        <td>${formatearFecha(prestamo.fechaPrestamo)}</td>
                        <td>${formatearFecha(prestamo.fechaDevolucion)}</td>
                        <td>${crearEstado(prestamo)}</td>

                        ${mostrarAcciones ? `
                            <td>
                                <div class="actions">
                                    <button
                                        class="return-button"
                                        data-devolver="${escaparHTML(prestamo.id)}"
                                    >
                                        Devolver
                                    </button>

                                    <button
                                        class="danger-button"
                                        data-extraviar="${escaparHTML(prestamo.id)}"
                                    >
                                        Extraviado
                                    </button>
                                </div>
                            </td>
                        ` : ""}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderizarPrestamos() {
    const activos = prestamos.filter(
        prestamo => prestamo.estado === "prestado"
    );

    $("#listaPrestamos").innerHTML = crearTablaPrestamos(
        activos,
        true
    );

    actualizarSelectorLibros();
}

function renderizarVencidos() {
    const vencidos = prestamos.filter(prestamoEstaVencido);

    $("#listaVencidos").innerHTML = crearTablaPrestamos(
        vencidos,
        true
    );
}

function renderizarHistorial() {
    const ordenados = [...prestamos].reverse();

    $("#listaHistorial").innerHTML = crearTablaPrestamos(
        ordenados,
        false
    );
}


/* REGISTRAR DEVOLUCIONES Y EXTRAVÍOS */

document.addEventListener("click", evento => {
    const botonDevolver = evento.target.closest("[data-devolver]");

    if (botonDevolver) {
        const prestamo = prestamos.find(
            elemento => elemento.id === botonDevolver.dataset.devolver
        );

        if (!prestamo || prestamo.estado !== "prestado") {
            mostrarMensaje("Este préstamo ya no está activo.");
            return;
        }

        const estadoAnterior = prestamo.estado;

        prestamo.estado = "devuelto";
        prestamo.fechaDevolucionReal = fechaLocal();

        if (!guardarPrestamos()) {
            prestamo.estado = estadoAnterior;
            prestamo.fechaDevolucionReal = null;
            return;
        }

        actualizarTodo();
        mostrarMensaje("Devolución registrada correctamente.");
        return;
    }

    const botonExtraviado = evento.target.closest("[data-extraviar]");

    if (botonExtraviado) {
        const prestamo = prestamos.find(
            elemento => elemento.id === botonExtraviado.dataset.extraviar
        );

        if (!prestamo || prestamo.estado !== "prestado") {
            mostrarMensaje("Este préstamo ya no está activo.");
            return;
        }

        const confirmado = confirm(
            "¿Confirmas que el ejemplar se ha extraviado? " +
            "Esta acción actualizará el inventario."
        );

        if (!confirmado) {
            return;
        }

        const libro = libros.find(
            elemento => elemento.id === prestamo.libroId
        );

        if (!libro) {
            mostrarMensaje("No se encontró el libro en el catálogo.");
            return;
        }

        prestamo.estado = "extraviado";
        prestamo.fechaDevolucionReal = null;
        libro.perdidos = Number(libro.perdidos || 0) + 1;

        if (!guardarPrestamos()) {
            prestamo.estado = "prestado";
            libro.perdidos -= 1;
            return;
        }

        if (!guardarLibros()) {
            prestamo.estado = "prestado";
            libro.perdidos -= 1;
            guardarPrestamos();
            return;
        }

        actualizarTodo();
        mostrarMensaje("El ejemplar se registró como extraviado.");
    }
});


/* ADMINISTRACIÓN DE LIBROS */

$("#formularioLibro").addEventListener("submit", evento => {
    evento.preventDefault();

    const titulo = $("#nuevoTitulo").value.trim();
    const autor = $("#nuevoAutor").value.trim();
    const categoria = $("#nuevaCategoria").value;
    const materia = $("#nuevaMateria").value.trim();
    const ubicacion = $("#nuevaUbicacion").value.trim();
    const cantidad = Number($("#nuevosEjemplares").value);

    if (!titulo || !autor || !categoria) {
        mostrarMensaje("Completa los campos obligatorios.");
        return;
    }

    if (
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > 1000
    ) {
        mostrarMensaje("Introduce una cantidad válida.");
        return;
    }

    const nuevoLibro = {
        id: crearId("LIB"),
        titulo,
        autor,
        categoria,
        materia,
        ubicacion,
        cantidad,
        perdidos: 0,
        descripcion: "",
        color: obtenerCategoria(categoria).color,
        simbolo: obtenerCategoria(categoria).icono
    };

    libros.push(nuevoLibro);

    if (!guardarLibros()) {
        libros.pop();
        return;
    }

    $("#formularioLibro").reset();
    $("#nuevosEjemplares").value = "1";

    actualizarTodo();
    mostrarMensaje("Libro agregado al catálogo.");
});

function renderizarAdministracion() {
    if (libros.length === 0) {
        $("#listaAdministracion").innerHTML =
            tablaVacia("Todavía no hay libros registrados.");

        return;
    }

    $("#listaAdministracion").innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoría</th>
                    <th>Ejemplares</th>
                    <th>Disponibles</th>
                    <th>Ubicación</th>
                </tr>
            </thead>

            <tbody>
                ${libros.map(libro => `
                    <tr>
                        <td>${escaparHTML(libro.id)}</td>
                        <td>${escaparHTML(libro.titulo)}</td>
                        <td>${escaparHTML(libro.autor)}</td>
                        <td>${escaparHTML(libro.categoria)}</td>
                        <td>${Number(libro.cantidad)}</td>
                        <td>${ejemplaresDisponibles(libro)}</td>
                        <td>${escaparHTML(libro.ubicacion || "Pendiente")}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}


/* ACTUALIZACIÓN GENERAL */

function actualizarTodo() {
    actualizarOpcionesCategorias();
    actualizarSelectorLibros();

    renderizarInicio();
    renderizarCatalogo();
    renderizarTodasCategorias();
    renderizarPrestamos();
    renderizarVencidos();
    renderizarHistorial();
    renderizarAdministracion();
}


/* INICIALIZACIÓN */

actualizarTodo();