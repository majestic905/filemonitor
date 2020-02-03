const fs = require('fs');
const path = require('path');
const file = path.join(process.argv[2], 'Jobs.xml');

function getJobsList() {
    return fs.promises.readFile(file, 'utf-8')
        .then(data => data.matchAll(/<JobGUID Path=".+">([\w-]+)<\/JobGUID>/g))
        .then(matches => Array.from(matches).map(item => item[1]));
}

module.exports = {getJobsList};