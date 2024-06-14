// Modificado para almacenar el resultado temporalmente y redirigir a datos.html
function generateReportsAndRedirect() {
    const transactions = getTransactions();
    const totalIngresos = transactions.reduce((acc, transaction) => acc + transaction.cobro, 0);
    const ocupacionPromedio = transactions.length / getSpaces().length;

    // Almacenar los resultados en sessionStorage para mostrar en datos.html
    sessionStorage.setItem('totalIngresos', totalIngresos);
    sessionStorage.setItem('ocupacionPromedio', ocupacionPromedio);

    // Redirigir a la página de datos
    window.location.href = 'datos.html';
}

// Función para mostrar los datos en datos.html
function showReports() {
    const totalIngresos = sessionStorage.getItem('totalIngresos');
    const ocupacionPromedio = sessionStorage.getItem('ocupacionPromedio');

    // Mostrar los resultados en la página datos.html (aquí puedes usar DOM para mostrar los resultados como desees)
    document.getElementById('totalIngresos').textContent = `Total Ingresos: ${totalIngresos}`;
    document.getElementById('ocupacionPromedio').textContent = `Ocupación Promedio: ${ocupacionPromedio}`;
}

