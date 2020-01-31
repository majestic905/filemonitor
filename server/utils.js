const fs = require('fs');
const path = require('path');
// const file = path.join(process.argv[2], 'Jobs.xml');

// function getJobsList() {
//     return fs.promises.readFile(file, 'utf-8')
//         .then(data => data.matchAll(/<JobGUID Path=".+">([\w-]+)<\/JobGUID>/g))
//         .then(matches => Array.from(matches).map(item => item[1]));
// }

// function normalizePath(path) {
// 	return path.replace(/\\/g, '/');
// }

function tree(dir) {
	const stats = fs.statSync(dir);

	if (stats.isFile()) {
    return {
      type: 'F', // file
      path: dir,
      name: path.basename(dir),
      size: stats.size,
      mtime: stats.mtime
    };
	} else if (stats.isDirectory()) {
    return {
      type: 'D', // directory
      path: dir,
      name: path.basename(dir),
      children: fs.readdirSync(dir).map(child => tree(path.join(dir, child)))
    }
	} else {
    return {
      type: 'U' // unknown
    };
  }
}

module.exports = {tree};