// This is the default code that comes with nodemon
// Unite uses no "server-side" code so far resulting 
// in a very small server.js

const http = require('http');
const path = require('path');
const express = require('express');
const app = express();    

app.use(express.static(path.join(__dirname, '')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

http.createServer(app).listen(8000, function(){
    console.log('Listening on port 8000');
});