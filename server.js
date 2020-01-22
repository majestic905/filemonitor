const express = require('express');
const app = express();

app.use(express.json());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

app.post('/jobsFileChanged', (req, res, next) => {
    console.log('notification received', req.body);
    return res.sendStatus(200);
});

app.use(function errorHandler(error, req, res, next) {
    console.error(error);
    return res.sendStatus(500).json({error: error.message});
});

app.listen(process.env.PORT || 5001);