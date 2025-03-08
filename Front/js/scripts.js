// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// ---------- CHARTS ----------


// Arrays para almacenar los datos históricos
let humidityData = [];
let temperatureData = [];
let gasData = [];
let timeData = []; // Para almacenar los tiempos en segundos

// Función para obtener datos del backend
async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/api/sensor-data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Función para actualizar los datos y el gráfico
function updateChart(chart, newData, dataArray, maxDataPoints = 10) {
  // Agregar el nuevo dato al array
  dataArray.push(newData);

  // Limitar el tamaño del array para que no crezca indefinidamente
  if (dataArray.length > maxDataPoints) {
    dataArray.shift(); // Eliminar el dato más antiguo
  }

  // Actualizar el gráfico
  chart.updateSeries([
    {
      name: 'Datos',
      data: dataArray.map((value, index) => ({
        x: timeData[index],
        y: value,
      })),
    },
  ]);
}
// Configuración del gráfico
const chartOptions = {
  series: [
    {
      name: 'Datos',
      data: [],
    },
  ],
  chart: {
    type: 'area',
    background: 'transparent',
    height: 350,
    stacked: false,
    toolbar: {
      show: false,
    },
    margin: {
      bottom: 50, // Aumentar aún más el margen inferior
    },
  },
  colors: ['#00ab57'],
  dataLabels: {
    enabled: false,
  },
  fill: {
    gradient: {
      opacityFrom: 0.4,
      opacityTo: 0.1,
      shadeIntensity: 1,
      stops: [0, 100],
      type: 'vertical',
    },
    type: 'gradient',
  },
  grid: {
    borderColor: '#55596e',
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      bottom: 20, // Añadir padding inferior para la grilla
    },
  },
  legend: {
    labels: {
      colors: '#f5f7ff',
    },
    show: true,
    position: 'top',
  },
  markers: {
    size: 6,
    strokeColors: '#1b2635',
    strokeWidth: 3,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: '#55596e',
      show: true,
    },
    axisTicks: {
      color: '#55596e',
      show: true,
    },
    labels: {
      offsetY: 5,
      style: {
        colors: '#f5f7ff',
        fontSize: '12px',
      },
      formatter: function (value) {
        return new Date(value).toLocaleTimeString();
      },
    },
    tickAmount: 10, // Aumentar la cantidad de ticks en el eje X
  },
  yaxis: {
    title: {
      text: 'Value',
      style: {
        color: '#f5f7ff',
      },
    },
    labels: {
      style: {
        colors: ['#ffffff'],
        fontSize: '12px',
      },
    },
    tickAmount: 10, // Aumentar la cantidad de ticks en el eje Y
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
  },
};

// Inicializar gráficos
const humidityChart = new ApexCharts(document.querySelector('#humidity-chart'), {
  ...chartOptions,
  colors: ['#00ab57'],
  yaxis: {
    title: {
      text: 'Humedad (%)',
      style: {
        color: '#f5f7ff',
      },
    },
    labels: {
      style: {
        colors: ['#ffffff'],
      },
    },
  },
});
humidityChart.render();

const temperatureChart = new ApexCharts(document.querySelector('#temperature-chart'), {
  ...chartOptions,
  colors: ['#d50000'],
  yaxis: {
    title: {
      text: 'Temperatura (°C)',
      style: {
        color: '#f5f7ff',
      },
    },
    labels: {
      style: {
        colors: ['#ffffff'],
      },
    },
  },
});
temperatureChart.render();

const gasChart = new ApexCharts(document.querySelector('#gas-chart'), {
  ...chartOptions,
  colors: ['#1b2635'],
  yaxis: {
    title: {
      text: 'Gas (ppm)',
      style: {
        color: '#f5f7ff',
      },
    },
    labels: {
      style: {
        colors: ['#ffffff'],
      },
    },
  },
});
gasChart.render();




// Función para actualizar los gráficos cada 5 segundos
async function updateCharts() {
  const data = await fetchData();
  if (data) {
    const currentTime = new Date().getTime(); // Obtener el tiempo actual en milisegundos

    // Agregar el tiempo actual al array de tiempos
    timeData.push(currentTime);
    if (timeData.length > 10) {
      timeData.shift(); // Limitar el tamaño del array de tiempos
    }

    // Actualizar los datos y los gráficos
    updateChart(humidityChart, parseFloat(data.humidity), humidityData);
    updateChart(temperatureChart, parseFloat(data.temperature), temperatureData);
    updateChart(gasChart, parseFloat(data.gas), gasData);
  }
}

// Actualizar gráficos cada 5 segundos
setInterval(updateCharts, 5000);








// Seleccionar los elementos donde se mostrarán los datos
const humidityElement = document.querySelector('.card:nth-child(1) h1');
const temperatureElement = document.querySelector('.card:nth-child(2) h1');
const gasElement = document.querySelector('.card:nth-child(3) h1');

// Función para obtener datos del backend
async function fetchSensorData() {
  try {
    const response = await fetch('http://localhost:3000/api/sensor-data');
    if (!response.ok) {
      throw new Error('Error al obtener los datos del backend');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return null;
  }
}

// Función para actualizar los valores en las tarjetas
async function updateSensorValues() {
  const sensorData = await fetchSensorData();
  if (sensorData) {
    // Actualizar los valores en las tarjetas
    humidityElement.textContent = `${sensorData.humidity}%`;
    temperatureElement.textContent = `${sensorData.temperature}°C`;
    gasElement.textContent = `${sensorData.gas} ppm`;
  }
}

// Llamar a la función cada 5 segundos
setInterval(updateSensorValues, 5000);

// Llamar la primera vez para cargar los datos iniciales
updateSensorValues();



// Selección de los cuerpos de las tablas
const humidityTableBody = document.getElementById('humidity-table-body');
const temperatureTableBody = document.getElementById('temperature-table-body');
const gasTableBody = document.getElementById('gas-table-body');

// Función para agregar filas a una tabla
function addRowToTable(tableBody, date, value) {
  const row = document.createElement('tr');

  // Modificar el formato de la fecha a '2/2/2025 14:30:45'
  const formattedDate = new Date(date).toLocaleString('es-ES', {
    day: 'numeric',     // Día del mes sin ceros iniciales
    month: 'numeric',   // Mes sin ceros iniciales
    year: 'numeric',    // Año completo
    hour: '2-digit',    // Hora con 2 dígitos
    minute: '2-digit',  // Minuto con 2 dígitos
    second: '2-digit'   // Segundo con 2 dígitos
  });

  row.innerHTML = `
    <td>${formattedDate}</td>
    <td>${value}</td>
  `;
  tableBody.appendChild(row);
  // Limitar las filas a 10
  if (tableBody.rows.length > 6) {
    tableBody.deleteRow(0);
  }
}

// Actualizar los gráficos y las tablas
async function updateChartsAndTables() {
  const data = await fetchSensorData();
  if (data) {
    const currentTime = new Date().getTime();


    // Actualizar tablas
    addRowToTable(humidityTableBody, currentTime, data.humidity);
    addRowToTable(temperatureTableBody, currentTime, data.temperature);
    addRowToTable(gasTableBody, currentTime, data.gas);
  }
}

// Llamar a la función cada 5 segundos
setInterval(updateChartsAndTables, 5000);
