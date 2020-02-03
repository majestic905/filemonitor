const fs = require('fs');``
const path = require('path');
const crypto = require('crypto');
const chokidar = require('chokidar');
const axios = require('axios');
const {getJobsList} = require('./utils');

function checkDirIsSpecified() {
    if (process.argv.length < 3)
        throw new Error("You must specify the directory to watch: node watcher.js [directory] or npm run start [directory].");
}

function checkDirExists() {
    if (!fs.existsSync(process.argv[2]))
        throw new Error("The specified directory does not exist.")
}

function checkJobsFileExists() {
    if (!fs.existsSync(path.join(process.argv[2], 'Jobs.xml')))
        throw new Error("The specified directory has no Jobs.xml file inside, aborting.");
}

function getClientId() {
    try {
        return fs.readFileSync(path.join(__dirname, '.id'), 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            const id = crypto.randomBytes(16).toString("hex");
            fs.writeFileSync(path.join(__dirname, '.id'), id, 'utf-8');
            return id;
        } else
            throw error;
    }
}

async function getRemoteFileTree(id) {
    const url = `http://localhost:5000/tree?id=${id}`;
    const response = await axios.get(url);
    return response.data;
}

(async function() {
    try {
        checkDirIsSpecified();
        checkDirExists();
        checkJobsFileExists();

        const id = getClientId();

        // get remote file tree (ctime, change times)
        // get local file tree (ctime, change times)
        // compare file trees
        // ...?
        
        // prevJobsList = await getJobsList();
        chokidar.watch(process.argv[2], {awaitWriteFinish: true}).on('all', handler);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();

// let prevJobsList = undefined;

function handler(event, path) {
    console.log(event, path);

    // getJobsList()
    //     .then(jobsList => {
    //         const newJobs = jobsList.filter(x => !prevJobsList.includes(x));
    //         prevJobsList = jobsList;
    //         return newJobs;
    //     })
    //     .then(newJobs => {
    //         if (newJobs.length > 0) {
    //             console.log(newJobs);
    //             // axios.post('http://localhost:5001/jobsFileChanged', {jobs: newJobs})
    //             //     .then(() => console.log('localhost:5000 notified'))
    //             //     .catch(error => console.error(error));
    //         }
    //     });
}