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
        } else {
            button.classList.remove('ocupado');
            button.classList.add('disponible');
            button.textContent = 'Disponible';
            this.checkAlert(spotName, 'disponible');
            this.clearForm();  // Limpiar el formulario
            this.validateForm();  // Validar el formulario para deshabilitar el botón
        }
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
}

// Define el nuevo custom element
customElements.define('parking-spot', ParkingSpot);


