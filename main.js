class Cliente {
    constructor(nombre, gastoTotal, promedioGastos, fechaIngreso) {
        this.nombre = nombre
        this.gastoTotal = gastoTotal
        this.promedioGastos = promedioGastos
        this.fechaIngreso = fechaIngreso
    }
}

class BaseClientes {
    constructor() {
        this.clientes = this.cargarClientes() || [] // Inicializa la lista de usuarios, array vacio o datos de la LS
    }

    agregarCliente(...cliente) {  //Mientras no se cambie el nombre del cliente, todos los gatos se añaden bajo el mismo nombre
        this.clientes.push(...cliente)
    }

    listarClientes() {
        if (this.clientes.length === 0) {
            swal.fire({
                title: 'No hay clientes',
                confirmButtonText: 'OK',
                icon: 'info'
            })
            return []
        }
        return this.clientes.map((cliente, index) =>
            `Cliente ${index + 1}: \nNombre: ${cliente.nombre}, \nGasto Total: ${cliente.gastoTotal}, \nPromedio de Gastos: ${cliente.promedioGastos}, \nFecha de Ingreso: ${cliente.fechaIngreso}`
        ).join('<br><br>') //salto de linea entre clientes
    }
    eliminarCliente(indice) {
        this.clientes.splice(indice,1)
    }

    cargarClientes() {
        const datos = localStorage.getItem('clientes') // Cargar los clientes que están en el LS
        return datos ? JSON.parse(datos) : null
    }
}

const baseClientes = new BaseClientes()

//Modificar el color de los botones
const botones = [
    { id: 'calcular', colorOriginal: 'white' },
    { id: 'ver', colorOriginal: 'white' },
    { id: 'eliminar', colorOriginal: 'white' },
    { id: 'borrarTodo', colorOriginal: 'white' },
    { id: 'iniciar', colorOriginal: 'white' },
    { id: 'salirSesion', colorOriginal: 'white' },
    { id: 'guardarCliente', colorOriginal: 'white' },
    { id: 'guardarGastos', colorOriginal: 'white' }
]

// Función para agregar eventos a cada botón
botones.forEach(boton => {
    const elemento = document.getElementById(boton.id)
    
    // Evento mouseover para cambiar el color a rojo
    elemento.addEventListener('mouseover', () => {
        elemento.classList.add('red')
    })
    
    // Evento mouseout para restaurar el color original
    elemento.addEventListener('mouseout', () => {
        elemento.classList.remove('red')
    })
})


//Mostrar el nombre de usuario y los formularios
let nombreEnLS = localStorage.getItem('nombre')
let Bienvenido = document.querySelector('#Bienvenido')
if (nombreEnLS) { //si tiene valor modifica el html
    Bienvenido.innerHTML = 'Bienvenido: ' + nombreEnLS
    formCliente.style.display = 'block' //mostrar formulario
    formGastos.style.display = 'block'
    formCalculo.style.display = 'block'
    calcular.style.display = 'block'
    ver.style.display = 'block'
    eliminar.style.display = 'block'
    borrarTodo.style.display = 'block'
    salirSesion.style.display = 'block'
    iniciar.style.display = 'none'
} else {
    formCliente.style.display = 'none' //no mostrar formulario
    formGastos.style.display = 'none'
    formCalculo.style.display = 'none'
    calcular.style.display = 'none'
    ver.style.display = 'none'
    eliminar.style.display = 'none'
    borrarTodo.style.display = 'none'
    iniciar.style.display = 'block'
    salirSesion.style.display = 'none'
}

// Preguntar al usuario si quiere ingresar a la base de datos
let botonAlert = document.querySelector('#iniciar')

botonAlert.addEventListener('click', () => {
    swal.fire({
        title: 'Bienvenido a la base de datos',
        text: '¿Deseas ingresar?',
        confirmButtonText: 'Si',
        icon: 'question',
        showDenyButton: true,
        denyButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            swal.fire({
                title: 'Ingresar Nombre Completo',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const nombre = result.value
                    localStorage.setItem("nombre",nombre)
                    let Bienvenido = document.querySelector('#Bienvenido')
                    Bienvenido.innerHTML = 'Bienvenido: ' + nombre
                    iniciar.style.display = 'none'
                    window.location.reload() //refrescar la página
        }
    })

    }

})
})

// Salir de sesión
const salir = document.querySelector('#salirSesion')
salir.onclick = () =>{
    localStorage.removeItem('nombre')
    window.location.reload() //recarga la página
}


//Guardar el nombre del cliente
const guardar = document.querySelector('#guardarCliente')
guardar.onclick = () =>{
    let nombreCliente = document.querySelector('#cliente').value
    if (!isNaN(nombreCliente)) {
        swal.fire({
            title: 'Ingresa un nombre valido',
            confirmButtonText: 'OK',
            icon: 'warning',
        }).then(() =>{
            document.querySelector('#cliente').value = ''
        })
    } else {
        nombreCliente.toLowerCase().trim()
        localStorage.setItem('nombreClientes',nombreCliente)
        document.querySelector('#cliente').value = ''
        swal.fire({
            title: 'Mientras no se cambie el nombre del cliente todos los datos serán guardados con el mismo nombre',
            confirmButtonText: 'OK',
            icon: 'warning'
        })
    }
}

//Ingresar gastos
let gastos = []

const guardarGastos = document.querySelector('#guardarGastos')
guardarGastos.onclick = () => {
    let dato = document.querySelector('#gastos').value
    if (isNaN(dato)) {
        swal.fire({
            title: 'Ingresa un número valido',
            confirmButtonText: 'OK',
            icon: 'warning',
        }).then(() =>{
            document.querySelector('#gastos').value = ''
        })
    } else {
        gastos.push(parseFloat(dato)) // Agregar el dato al array de gastos
        document.querySelector('#gastos').value = '' //Limpiar el input
    }
}

// Calcular gastos 
const calcularGastos = document.querySelector('#calcular')
calcularGastos.onclick = () => {
    

    let suma = 0
    gastos.forEach(valor => {
    suma += parseFloat(valor)
    })
    
    //Calculo promedio de los gastos
    let promedio = gastos.length > 0 ? suma / gastos.length : 0

    //Fecha de ingreso
    let fechaIngreso = new Date().toDateString()

    // Obtener nombre del cliente de la LS
    nombreclienteLS = obtenerDatos()

    //Verificar que el LS no está vacio
    if (nombreclienteLS) {
        //Ingresar datos a Usuario
        const cliente = new Cliente(nombreclienteLS, suma, promedio, fechaIngreso)
        baseClientes.agregarCliente(cliente) //Guardar en el constructor
        guardarDatos(baseClientes.clientes) //Guardar en el LS 

        // Mostrar los resultados en el HTML
        document.querySelector('#suma').innerHTML = `Suma total: ${suma}`
        document.querySelector('#promedio').innerHTML = `Promedio: ${promedio}`       
    } else {
        swal.fire({
            title: 'Ingresa primero un nombre',
            text: 'Vuelve a ingresar los gastos',
            confirmButtonText: 'OK',
            icon: 'warning',
        })
    }
    gastos = []

}

// Función para obtener el nombre del cliente del LS
function obtenerDatos() {
    localStorage.getItem('nombreClientes')
}

// Función para guardar los datos en el localStorage
function guardarDatos(datos) {
    localStorage.setItem('clientes', JSON.stringify(datos)) // Guarda el array como JSON en el LS
}

//Ver clientes
const verClientes = document.querySelector('#ver')
verClientes.onclick = () => {
    const clientes = baseClientes.listarClientes()
    if (clientes.length > 0) {
        swal.fire({
            title: 'Lista de Clientes',
            html: clientes,
            confirmButtonText: 'OK',
            icon: 'info'
        })
    }
}

//Borrar clientes
const borrarCliente = document.querySelector('#eliminar')
borrarCliente.onclick = () => {
    swal.fire({
        title: '¿Quieres borrar clientes?',
        input: 'number',
        inputLabel: 'Número de clientes a borrar',
        inputPlaceholder: 'Ingresa el número de clientes',
        icon: 'warning',
        confirmButtonText: 'Si, quiero continuar',
        showDenyButton: true,
        denyButtonText: 'NO',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes ingresar un número'
            }
            if (isNaN(value) || value <= 0) {
                return 'Ingresa un número válido mayor a 0'
            }
            return null
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const cantidadClientes = parseInt(result.value) //Variable para uso del for mas adelante
                //Verificar si hay clientes para eliminar
                if (baseClientes.clientes.length === 0) {
                    swal.fire({
                        title: 'No hay clientes a eliminar',
                        confirmButtonText: 'OK',
                        icon: 'warning',
                    })
                    return
                } 

                for (let i = 0; i < cantidadClientes; i++) {
                    if (baseClientes.clientes.length === 0) {
                        swal.fire({
                            title: 'No hay más clientes para eliminar',
                            confirmButtonText: 'OK',
                            icon: 'warning',
                        })
                        break
                    }
                
                        
                    const clientes = baseClientes.listarClientes() //traer la clase del LS

                    //Me muestra la lista de clientes

                    swal.fire({     
                    title: 'Lista de Clientes',
                    html: clientes,
                    confirmButtonText: 'OK',
                    icon: 'info'
                    }).then(() => {

                    //Preguntar cual cliente quiere eliminar
                    swal.fire({     
                        title: '¿Cual cliente quieres borrar?',
                        inputPlaceholder: 'Ingresa el número del clientel', 
                        icon: 'warning',
                        input: 'number',
                        confirmButtonText: 'OK',
                        showDenyButton: true,
                        denyButtonText: 'NO',
                        inputValidator: (value) => {
                            if (!value) {
                                return 'Debes ingresar un número'
                            }
                            if (isNaN(value) || value <= 0 || value > baseClientes.clientes.length) {
                                return 'Ingresa un número válido'
                            }
                            return null
                        }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const numeroCliente = parseInt(result.value) //numero del cliente a eliminar
                                baseClientes.eliminarCliente(numeroCliente - 1)
                                guardarDatos(baseClientes.clientes) //Actualizar el LS
                            }
                        })
                    })
                }
            }
        })
    }


//Borrar LS
const eliminarTodo = document.querySelector('#borrarTodo')
eliminarTodo.onclick = () => {
    swal.fire({
        title: 'Al realizar esta acción, deberas volver a iniciar sesión',
        text: '¿Deseas continuar?',
        icon: 'warning',
        confirmButtonText: 'Si, quiero continuar',
        showDenyButton: true,
        denyButtonText: 'NO'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            window.location.reload()
        } 
    })
    
}

