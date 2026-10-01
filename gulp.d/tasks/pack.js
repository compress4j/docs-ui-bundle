'use strict'

const vfs = require('vinyl-fs')
const zip = require('gulp-vinyl-zip')
const path = require('node:path')

module.exports = function pack (src, dest, bundleName, onFinish) {
  return () =>
    vfs
      .src('**/*', { base: src, cwd: src, encoding: false })
      .pipe(zip.dest(path.join(dest, `${bundleName}-bundle.zip`)))
      .on('finish', () => onFinish?.(path.resolve(dest, `${bundleName}-bundle.zip`)))
}
