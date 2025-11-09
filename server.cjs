const express = require('express');
const path = require('path');

const app = express();

// Ruta donde se encuentra tu build
const distPath = path.join(__dirname, 'dist');

// Servir contenido estático
app.use(express.static(distPath));

// Fallback para history mode
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Frontend corriendo en el puerto ${port}`);
});
