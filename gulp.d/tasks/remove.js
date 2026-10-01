'use strict'

const fs = require('fs-extra')
const { Transform } = require('node:stream')
const map = (transform) => new Transform({ objectMode: true, transform })
const vfs = require('vinyl-fs')

module.exports = function remove (files) {
  return () => vfs.src(files, { allowEmpty: true }).pipe(map((file, enc, next) => fs.remove(file.path, next)))
}
