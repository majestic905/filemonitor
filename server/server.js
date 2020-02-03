const express = require('express');
const app = express();
const path = require('path');
const {fileTree} = require('./utils');
const fs = require('fs');

app.use(express.json());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

// app.post('/jobsFileChanged', (req, res, next) => {
//     console.log('notification received', req.body);
//     return res.sendStatus(200);
// });

app.get('/file', (req, res, next) => {
    return fs.promises.readFile(req.query.path, 'utf-8')
        .then(data => res.send(data))
        .catch(next);
});

app.get('/events', (req, res, next) => {
    const events = [
        {
            timestamp: new Date(2020, 0, 1, 12, 0).toLocaleString(),
            files: [
                path.join('storage', '2cda104f-b7e8-443d-8e8b-4f325a981b12', 'RIPEngine.xml'),
                path.join('storage', '2cda104f-b7e8-443d-8e8b-4f325a981b12', 'Meta', '00001.xml'),
            ]
        },
        {
            timestamp: new Date(2020, 0, 1, 12, 22).toLocaleString(),
            files: [
                path.join('storage', '03a2fd11-d5d6-40f5-8b8d-5cf1ac7b4ece', 'Settings.xml'),
                path.join('storage', '03a2fd11-d5d6-40f5-8b8d-5cf1ac7b4ece', 'Meta', 'info.xml'),
            ]
        }
    ];

    return res.json(events);
});

app.get('/tree', (req, res, next) => res.json(fileTree('storage')));

app.get('/', (req, res, next) => res.sendFile(path.join('web', 'index.html')));

app.use(function errorHandler(error, req, res, next) {
    console.error(error);
    return res.sendStatus(500).json({error: error.message});
});

app.listen(process.env.PORT || 5000);