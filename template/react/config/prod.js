const string = require('./utils').string

module.exports = {
    'process.env.NODE_ENV': string('production'),
    'cdn': string('')
}