const fs = require('fs');
const path = require('path');

function checkDirIsSpecified() {
    if (process.argv.length < 3)
        throw new Error("You must specify the directory to watch: node server.js [directory] or npm run start [directory].");
}

function checkDirExists() {
    if (!fs.existsSync(process.argv[2]))
        throw new Error("The specified directory does not exist.")
}

function checkJobsFileExists() {
    if (!fs.existsSync(path.join(process.argv[2], 'Jobs.xml')))
        throw new Error("The specified directory has no Jobs.xml file inside, aborting.");
}

(function() {
    try {
        checkDirIsSpecified();
        checkDirExists();
        checkJobsFileExists();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();

const express = require('express');
const archiver = require('archiver');
const {getJobsList} = require('./utils');
require('./watcher');

const app = express();

app.use(express.json());
app.use(require('helmet')());
app.use(require('morgan')('dev'));

app.get('/jobs/:slug',
    function checkDirExists(req, res, next) {
        res.locals.dir = path.join(process.argv[2], req.params.slug);
        return fs.promises.access(res.locals.dir).then(next).catch(next);
    },
    function zipDirAndStream(req, res, next) {
        const filename = `${req.params.slug}_${new Date().toISOString().slice(0, 10)}`;
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename=${filename}.zip`);

        const archive = archiver('zip', {zlib: {level: 0}});  
        archive.on('warning', next);
        archive.on('error', next);
        archive.pipe(res);
        archive.directory(res.locals.dir, req.params.slug);
        archive.finalize();
    }
);

app.get('/jobs', function sendJobNames(req, res, next) {
    return getJobsList()
        .then(jobs => res.status(200).json({jobs}))
        .catch(next);
});

app.use(function errorHandler(error, req, res, next) {
    console.error(error);
    return res.sendStatus(500).json({error: error.message});
});

app.listen(process.env.PORT || 5000);