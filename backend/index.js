// ===========================================
// INITIALIZE
// ===========================================

// basic imports
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: '../.env.local', override: true });
const { join } = require('path')

// init express
const express = require("express");
const app = express();
app.use(require('cors')());
app.use(require('body-parser').json());
// import websocket
require('express-ws')(app);

// ===========================================
// Websocket
// ===========================================
app.ws('/api/ws', require('./actions/ws').wsHandler)

// ===========================================
// Base routers
// ===========================================
app.use(express.static(join(__dirname, '..', 'dist')));
app.get('*', (_, res)=>{
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
})

// ===========================================
// START APP
// ===========================================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const { getLocalIP } = require("./utils/tools");

app.listen(PORT, HOST, ()=>{
    console.log(
`Server is running on http://localhost:${PORT}
Find your application on LAN: http://${getLocalIP()}:${PORT}`
);
});