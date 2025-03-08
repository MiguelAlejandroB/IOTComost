const express = require('express');
const app = express();
const port = 3050;

// Middleware para parsear JSON
app.use(express.json());

// Datos iniciales
let sensorData = {
    Humedad: 0,
    temperaura: 0,
    conductividad: 0
};

// Endpoint POST para recibir datos
app.post('/data', (req, res) => {
    const { Humedad, temperaura, conductividad } = req.body;
    
    // Actualizar los datos
    sensorData = {
        Humedad: Humedad || sensorData.Humedad,
        temperaura: temperaura || sensorData.temperaura,
        conductividad: conductividad || sensorData.conductividad
    };

    res.status(200).send('Datos actualizados correctamente');
});

// Endpoint GET para mostrar datos
app.get('/data', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(sensorData, null, 2));
});

app.listen(process.env.PORT || port, () => {
    console.log(`Servidor corriendo`);
  });