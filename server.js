const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para JSON y archivos estáticos
app.use(express.json());
app.use(express.static('.')); // Sirve index.html y JS

// Leer todas las pinturas
app.get('/pinturas', (req, res) => {
    fs.readFile('allPaints.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error leyendo el archivo');
        res.json(JSON.parse(data));
    });
});

// Modificar propiedad 'obtenido'
app.patch('/modificar', (req, res) => {
    const { nombre } = req.body;
    //console.log("hola Mundo");
    fs.readFile('allPaints.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error leyendo el archivo');

        let jsonData = JSON.parse(data);
        let item = jsonData.data.find(p => p.nombre === nombre);
        if (!item) return res.status(404).send('Pintura no encontrada');

        item.obtenido = !item.obtenido;

        fs.writeFile('allPaints.json', JSON.stringify(jsonData, null, 4), err => {
            if (err) return res.status(500).send('Error guardando cambios');
            res.json({ success: true, nuevoValor: item.obtenido });
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});