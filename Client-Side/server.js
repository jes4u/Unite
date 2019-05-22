const http = require('http');
const path = require('path');
const express = require('express');
const app = express();    

// app.use(express.static(path.join(__dirname, '')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// http.createServer(app).listen(8000, function(){
//     console.log('Listening on port 8000');
// });

var fs = require('fs');
fs.readFile('Data/GeoJSONFiles/citypoint.geojson', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    //console.log(obj['features']);
    for (var feature in obj['features']) {
        console.log(feature['properties']);
        if (feature.properties.NAME == null) {
            delete feature;
        }
    }
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}});