const express = require('express');
const app = express();
const path = require('path');
const {tree} = require('./utils');
const fs = require('fs');

app.use(express.json());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

// app.post('/jobsFileChanged', (req, res, next) => {
//     console.log('notification received', req.body);
//     return res.sendStatus(200);
// });

app.get('/file', (req, res, next) => {
    let _path = req.query.path;
    if (!_path.startsWith('c:\\'))
        _path = path.join(__dirname, _path);
    return fs.promises.readFile(_path, 'utf-8')
        .then(data => res.send(data))
        .catch(next);
});

app.get('/tree', (req, res, next) => res.json(tree(path.join(__dirname, 'storage'))));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'web', 'index.html')));

app.use(function errorHandler(error, req, res, next) {
    console.error(error);
    return res.sendStatus(500).json({error: error.message});
});

app.listen(process.env.PORT || 5000);