const fs = require('fs')

const dir = './build'

fs.mkdirSync(dir, { recursive: true });
fs.renameSync('build', '../build')
