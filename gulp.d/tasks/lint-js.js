'use strict'

const eslint = require('gulp-eslint-new')
const vfs = require('vinyl-fs')

module.exports = function lintJs (files) {
  return (done) =>
    vfs.src(files).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError()).on('error', done)
}
