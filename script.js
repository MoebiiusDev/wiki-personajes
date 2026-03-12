const PREFIX = "wcp_"

function generarID() {

    return "dada_" + Date.now() + "_" + Math.floor(Math.random() * 10000)

}
let seccionActual = null
let editandoIndex = null

function obtenerSecciones() {

    let data = localStorage.getItem(PREFIX + "sections")

    return data ? JSON.parse(data) : []

}


function guardarSecciones(secciones) {

    localStorage.setItem(PREFIX + "sections", JSON.stringify(secciones))

}


function crearSeccion() {

    let nombre = prompt("Nombre de la sección")

    if (!nombre) return

    let secciones = obtenerSecciones()

    secciones.push(nombre)

    guardarSecciones(secciones)

    mostrarSecciones()

}


function mostrarSecciones() {

    let lista = document.getElementById("sectionsList")

    lista.innerHTML = ""

    // Sección fija
    let liTodos = document.createElement("li")

    liTodos.innerHTML = `
<span onclick="abrirSeccion(null)"><b>Todos</b></span>
`

    lista.appendChild(liTodos)

    let secciones = obtenerSecciones()

    secciones.forEach((sec, index) => {

        let li = document.createElement("li")

        li.innerHTML = `
<span onclick="abrirSeccion('${sec}')">${sec}</span>

<button onclick="editarSeccion(${index})">✎</button>
<button onclick="eliminarSeccion(${index})">🗑</button>
`

        lista.appendChild(li)

    })

}


function abrirSeccion(nombre) {

    seccionActual = nombre

    if (nombre === null) {
        document.getElementById("sectionTitle").textContent = "Todos los personajes"
    } else {
        document.getElementById("sectionTitle").textContent = nombre
    }

    mostrarPersonajes()

}

function editarSeccion(index) {

    let secciones = obtenerSecciones()

    let nuevoNombre = prompt("Nuevo nombre", secciones[index])

    if (!nuevoNombre) return

    secciones[index] = nuevoNombre

    guardarSecciones(secciones)

    mostrarSecciones()

}

function eliminarSeccion(index) {

    if (!confirm("¿Eliminar esta sección?")) return

    let secciones = obtenerSecciones()

    secciones.splice(index, 1)

    guardarSecciones(secciones)

    mostrarSecciones()

}


function abrirModal() {

    if (seccionActual === null) {

        alert("Debes entrar a una sección para crear un personaje")
        return

    }

    editandoIndex = null

    document.getElementById("modalTitle").textContent = "Nuevo personaje"

    limpiarFormulario()

    document.getElementById("modal").style.display = "block"

}


function cerrarModal() {

    document.getElementById("modal").style.display = "none"

    limpiarFormulario()

    editandoIndex = null

}


function obtenerPersonajes() {

    let data = localStorage.getItem(PREFIX + "characters")

    let personajes = data ? JSON.parse(data) : []

    personajes = personajes.filter(p => p && p.id && p.nombre)

    personajes.forEach(p => {

        if (!p.secciones) {

            if (p.seccion) {
                p.secciones = [p.seccion]
            } else {
                p.secciones = []
            }

            delete p.seccion

        }

    })

    localStorage.setItem(PREFIX + "characters", JSON.stringify(personajes))

    return personajes

}

function guardarPersonaje() {

    let nombreCompleto = document.getElementById("charFullName").value

    let nombre = document.getElementById("charName").value
    let edad = document.getElementById("charAge").value
    let sexo = document.getElementById("charGender").value
    let raza = document.getElementById("charRace").value
    let tamano = document.getElementById("charSize").value
    
    let peso = document.getElementById("charWeight").value
    let ojos = document.getElementById("charEyes").value
    let piel = document.getElementById("charSkin").value
    let cabello = document.getElementById("charHair").value
    let especial = document.getElementById("charSpecial").value

    let origen = document.getElementById("charOrigin").value
    let poder = document.getElementById("charPower").value

    //let desc = document.getElementById("charDesc").value

    let imgFile = document.getElementById("charImage").files[0]

    let personajes = obtenerPersonajes()

    let imagenAnterior = ""

    if (editandoIndex !== null) {
        imagenAnterior = personajes[editandoIndex].img
    }

    function guardar(img) {

        let personaje = {

            id: editandoIndex !== null ? personajes[editandoIndex].id : generarID(),
            nombre,
            nombreCompleto,
            edad,
            raza,
            sexo,
            tamano,
            peso,
            ojos,
            piel,
            cabello,
            especial,
            origen,
            //desc,
            img,
            poder,
            secciones: editandoIndex !== null
                ? personajes[editandoIndex].secciones
                : (seccionActual ? [seccionActual] : [])
        }

        if (editandoIndex !== null) {

            personajes[editandoIndex] = personaje
            editandoIndex = null

        } else {

            personajes.push(personaje)

        }

        localStorage.setItem(PREFIX + "characters", JSON.stringify(personajes))

        cerrarModal()
        mostrarPersonajes()

    }

    if (imgFile) {

        let reader = new FileReader()

        reader.onload = () => guardar(reader.result)

        reader.readAsDataURL(imgFile)

    } else {

        guardar(imagenAnterior)

    }

}


function mostrarPersonajes() {

    let cont = document.getElementById("charactersContainer")

    cont.innerHTML = ""

    let personajes = obtenerPersonajes()

    personajes
        .filter(p => !seccionActual || (p.secciones && p.secciones.includes(seccionActual)))
        .forEach((p, index) => {

            let card = document.createElement("div")
            card.className = "card"

            card.innerHTML = `

<button class="editBtn" onclick="editarPersonaje('${p.id}')">✎</button>
<button class="deleteBtn" onclick="eliminarPersonaje('${p.id}')">🗑</button>

<div class="card-header">

<img src="${p.img}">

<div class="card-title">

<h3>${p.nombre}</h3>
<p class="fullname">${p.nombreCompleto || ""}</p>

</div>

</div>

<div class="card-info">

<p><b>Origen:</b> ${p.origen}</p>
<p><b>Genero:</b> ${p.sexo}</p>

<p><b>Edad:</b> ${p.edad}</p>
<p><b>Raza:</b> ${p.raza}</p>
<p><b>Altura:</b> ${p.tamano}</p>
<p><b>Peso:</b> ${p.peso}</p>


<p><b>Ojos:</b> ${p.ojos}</p>
<p><b>Piel:</b> ${p.piel}</p>
<p><b>Cabello:</b> ${p.cabello}</p>

<p><b>Especial:</b> ${p.especial}</p>

<hr>
<p><b>Poder:</b> ${p.poder}</p>

</div>
`

            cont.appendChild(card)

        })

}

function editarPersonaje(id) {



    let personajes = obtenerPersonajes()

    let p = personajes.find(x => x.id === id)

    if (!p) {
        alert("Este personaje está corrupto y será eliminado.")
        eliminarPersonaje(id)
        return
    }

    editandoIndex = personajes.findIndex(x => x.id === id)

    document.getElementById("modalTitle").textContent = "Editar personaje"

    document.getElementById("charName").value = p.nombre
    document.getElementById("charFullName").value = p.nombreCompleto || ""
    document.getElementById("charAge").value = p.edad
    document.getElementById("charRace").value = p.raza
    document.getElementById("charSize").value = p.tamano
    document.getElementById("charGender").value = p.sexo

    document.getElementById("charWeight").value = p.peso


    document.getElementById("charEyes").value = p.ojos
    document.getElementById("charSkin").value = p.piel
    document.getElementById("charHair").value = p.cabello
    document.getElementById("charSpecial").value = p.especial

    document.getElementById("charOrigin").value = p.origen
    document.getElementById("charPower").value = p.poder


    //document.getElementById("charDesc").value = p.desc

    document.getElementById("modal").style.display = "block"

}

function eliminarPersonaje(id) {

    if (!confirm("¿Eliminar este personaje?")) return

    let personajes = obtenerPersonajes()

    let p = personajes.find(x => x.id === id)

    if (!p) return

    // si estamos en una sección -> solo quitar de esa sección
    if (seccionActual) {

        p.secciones = p.secciones.filter(s => s !== seccionActual)

    } else {

        // si estamos en el núcleo -> borrar completamente
        personajes = personajes.filter(x => x.id !== id)

    }

    localStorage.setItem(PREFIX + "characters", JSON.stringify(personajes))

    mostrarPersonajes()

}

function limpiarFormulario() {

    document.getElementById("charName").value = ""
    document.getElementById("charFullName").value = ""
    document.getElementById("charAge").value = ""
    document.getElementById("charRace").value = ""
    document.getElementById("charSize").value = ""
    document.getElementById("charWeight").value = ""

    document.getElementById("charEyes").value = ""
    document.getElementById("charSkin").value = ""
    document.getElementById("charHair").value = ""
    document.getElementById("charSpecial").value = ""

    document.getElementById("charOrigin").value = ""
    document.getElementById("charGender").value = ""

    //document.getElementById("charDesc").value = ""

    document.getElementById("charImage").value = ""
    document.getElementById("charPower").value = ""

}

function buscarPersonajes() {

    let texto = document.getElementById("searchBar").value.toLowerCase()

    let cards = document.querySelectorAll(".card")

    cards.forEach(card => {

        let nombre = card.querySelector("h3").textContent.toLowerCase()

        if (nombre.includes(texto)) {
            card.style.display = "block"
        } else {
            card.style.display = "none"
        }

    })

}


mostrarSecciones()
abrirSeccion(null)