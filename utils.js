const join = require('path').join;
const readFile = require('fs').promises.readFile;
const file = join(process.argv[2], 'Jobs.xml')

function getJobsList() {
    return readFile(file, 'utf-8')
        .then(data => data.matchAll(/<JobGUID Path=".+">([\w-]+)<\/JobGUID>/g))
        .then(matches => Array.from(matches).map(item => item[1]));
}

module.exports = {getJobsList};