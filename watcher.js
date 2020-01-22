const path = require('path');
const chokidar = require('chokidar');
const axios = require('axios');
const {getJobsList} = require('./utils');
const dir = path.join(process.argv[2], 'Jobs.xml');

let prevJobsList = undefined;

function handler(event, path) {
    getJobsList()
        .then(jobsList => {
            const newJobs = jobsList.filter(x => !prevJobsList.includes(x));
            prevJobsList = jobsList;
            return newJobs;
        })
        .then(newJobs => {
            if (newJobs.length > 0) {
                console.log(newJobs);
                // axios.post('http://localhost:5001/jobsFileChanged', {jobs: newJobs})
                //     .then(() => console.log('localhost:5000 notified'))
                //     .catch(error => console.error(error));
            }
        });
}

(async function() {
    prevJobsList = await getJobsList();
    chokidar.watch(dir, {awaitWriteFinish: true}).on('change', handler);
})();