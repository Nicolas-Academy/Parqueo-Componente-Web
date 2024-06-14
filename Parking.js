class ParkingSpot extends HTMLElement {
    constructor() {
        super();
        // Obtiene el contenido del template con el id 'parking-spot-template'
        const template = document.getElementById('parking-spot-template').content;
        // Crea un shadow DOM en modo 'open' y le agrega una copia del contenido del template
        this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
    }

    connectedCallback() {
        // Configura el nombre del espacio de estacionamiento
        this.shadowRoot.getElementById('spot-name').textContent = this.getAttribute('spot-name');
        
        // Agrega un listener al botón de estado para cambiar entre disponible y ocupado
        this.shadowRoot.getElementById('estado_btn').addEventListener('click', this.toggleStatus.bind(this));

        // Agregar validación del formulario
        const form = this.shadowRoot.querySelector('form');
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => input.addEventListener('input', this.validateForm.bind(this)));

        // Agregar eventos específicos para el cálculo del cobro
        const horaIngreso = this.shadowRoot.getElementById('hora_ingreso');
        const horaSalida = this.shadowRoot.getElementById('hora_salida');
        horaIngreso.addEventListener('change', this.calculateCharge.bind(this));
        horaSalida.addEventListener('change', this.calculateCharge.bind(this));

        // Valida el formulario al inicio
        this.validateForm();
    }

    validateForm() {
        // Valida el formulario y habilita o deshabilita el botón según la validez del formulario
        const form = this.shadowRoot.querySelector('form');
        const button = this.shadowRoot.getElementById('estado_btn');
        button.disabled = !form.checkValidity();
    }

    toggleStatus() {
        // Alterna el estado del espacio de estacionamiento entre 'disponible' y 'ocupado'
        const button = this.shadowRoot.getElementById('estado_btn');
        const spotName = this.getAttribute('spot-name');

        if (button.classList.contains('disponible')) {
            button.classList.remove('disponible');
            button.classList.add('ocupado');
            button.textContent = 'Ocupado';
            this.checkAlert(spotName, 'ocupado');
            this.registerTransaction();  // Registra la transacción cuando el espacio se ocupa
            addTransaction(transaction); // Guarda la transacción en localStorage
        } else {
            button.classList.remove('ocupado');
            button.classList.add('disponible');
            button.textContent = 'Disponible';
            this.checkAlert(spotName, 'disponible');
            this.registerTransaction();  // Registrar la transacción cuando el espacio se libera
            this.clearForm();  // Limpiar el formulario
            this.validateForm();  // Validar el formulario para deshabilitar el botón
        }
        generateReports();  // Llama a la función para generar los informes después de cada cambio
    }

    clearForm() {
        // Resetea los campos del formulario y limpia el campo de cobro
        const form = this.shadowRoot.querySelector('form');
        form.reset();
        this.shadowRoot.getElementById('cobro').value = '';  // Limpiar el campo de cobro
    }

    calculateCharge() {
        // Calcula el cobro basado en las horas de ingreso y salida
        const horaIngreso = this.shadowRoot.getElementById('hora_ingreso').value;
        const horaSalida = this.shadowRoot.getElementById('hora_salida').value;

        if (horaIngreso && horaSalida) {
            const [ingresoHoras, ingresoMinutos] = horaIngreso.split(':').map(Number);
            const [salidaHoras, salidaMinutos] = horaSalida.split(':').map(Number);

            const ingresoTotalMinutos = (ingresoHoras * 60) + ingresoMinutos;
            const salidaTotalMinutos = (salidaHoras * 60) + salidaMinutos;

            // Calcula el total de horas
            let totalHoras = (salidaTotalMinutos - ingresoTotalMinutos) / 60;
            if (totalHoras < 0) {
                totalHoras += 24;  // Ajustar para cambio de día
            }

            // Calcula el total a cobrar (10 unidades por hora)
            const totalCobro = totalHoras * 10;
            this.shadowRoot.getElementById('cobro').value = totalCobro.toFixed(2);
        }
    }

    checkAlert(spotName, status) {
        // Verifica si el espacio está en la lista de alertas y muestra un mensaje
        const alertSpots = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'];
        if (alertSpots.includes(spotName)) {
            if (status === 'ocupado') {
                alert(`El espacio ${spotName} está ahora ocupado.`);
            } else {
                alert(`El espacio ${spotName} está ahora disponible.`);
            }
        }
    }

    registerTransaction() {
        // Registra la transacción cuando el espacio se libera
        const spotName = this.getAttribute('spot-name');
        const horaIngreso = this.shadowRoot.getElementById('hora_ingreso').value;
        const horaSalida = this.shadowRoot.getElementById('hora_salida').value;
        const cobro = this.shadowRoot.getElementById('cobro').value;

        if (horaIngreso && horaSalida && cobro) {
            const transaction = {
                id: Date.now(),
                spotName: spotName,
                horaIngreso: horaIngreso,
                horaSalida: horaSalida,
                cobro: parseFloat(cobro)
            };
            addTransaction(transaction);
        }
    }
}

// Define el nuevo custom element
customElements.define('parking-spot', ParkingSpot);


// Función para inicializar el almacenamiento local con estructuras de datos vacías si no existen
function initializeLocalStorage() {
    if (!localStorage.getItem('spaces')) {
        localStorage.setItem('spaces', JSON.stringify([]));
    }
    if (!localStorage.getItem('vehicles')) {
        localStorage.setItem('vehicles', JSON.stringify([]));
    }
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }
}

// Función para agregar un espacio
function addSpace(space) {
    let spaces = JSON.parse(localStorage.getItem('spaces'));
    spaces.push(space);
    localStorage.setItem('spaces', JSON.stringify(spaces));
}

// Función para obtener todos los espacios
function getSpaces() {
    return JSON.parse(localStorage.getItem('spaces'));
}

// Función para agregar un vehículo
function addVehicle(vehicle) {
    let vehicles = JSON.parse(localStorage.getItem('vehicles'));
    vehicles.push(vehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Función para obtener todos los vehículos
function getVehicles() {
    return JSON.parse(localStorage.getItem('vehicles'));
}

// Función para agregar una transacción
function addTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Función para obtener todas las transacciones
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions'));
}

// Función para actualizar un espacio (basado en ID)
function updateSpace(updatedSpace) {
    let spaces = JSON.parse(localStorage.getItem('spaces'));
    let index = spaces.findIndex(space => space.id === updatedSpace.id);
    if (index !== -1) {
        spaces[index] = updatedSpace;
        localStorage.setItem('spaces', JSON.stringify(spaces));
    }
}

// Función para actualizar un vehículo (basado en ID)
function updateVehicle(updatedVehicle) {
    let vehicles = JSON.parse(localStorage.getItem('vehicles'));
    let index = vehicles.findIndex(vehicle => vehicle.id === updatedVehicle.id);
    if (index !== -1) {
        vehicles[index] = updatedVehicle;
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
}

// Función para actualizar una transacción (basado en ID)
function updateTransaction(updatedTransaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions'));
    let index = transactions.findIndex(transaction => transaction.id === updatedTransaction.id);
    if (index !== -1) {
        transactions[index] = updatedTransaction;
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
}

// Función para eliminar un espacio (basado en ID)
function deleteSpace(spaceId) {
    let spaces = JSON.parse(localStorage.getItem('spaces'));
    spaces = spaces.filter(space => space.id !== spaceId);
    localStorage.setItem('spaces', JSON.stringify(spaces));
}

// Función para eliminar un vehículo (basado en ID)
function deleteVehicle(vehicleId) {
    let vehicles = JSON.parse(localStorage.getItem('vehicles'));
    vehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Función para eliminar una transacción (basado en ID)
function deleteTransaction(transactionId) {
    let transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions = transactions.filter(transaction => transaction.id !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Función para generar informes
function generateReports() {
    const transactions = getTransactions();
    const totalIngresos = transactions.reduce((acc, transaction) => acc + transaction.cobro, 0);
    const ocupacionPromedio = transactions.length / getSpaces().length;

    console.log(`Total Ingresos: ${totalIngresos}`);
    console.log(`Ocupación Promedio: ${ocupacionPromedio}`);
}

// Inicializa el almacenamiento local al cargar la página
initializeLocalStorage();

// Agregar botón para generar informes y mostrar estadísticas
const reportButton = document.createElement('button');
reportButton.textContent = 'Generar Informe';
reportButton.addEventListener('click', () => {
    generateReports();
    window.location.href = 'datos.html';  // Redirige a datos.html para ver el informe completo
});
document.body.appendChild(reportButton);
