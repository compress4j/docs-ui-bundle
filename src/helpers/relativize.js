'use strict'

const { posix: path } = require('node:path')

module.exports = function relativize (to, from, ctx) {
  if (!to) return '#'
  // NOTE only legacy invocation provides both to and from
  if (!ctx) {
    ctx = from
    from = ctx.data.root.page.url
  }
  if (to.charAt() !== '/') return to
  if (!from) return (ctx.data.root.site.path || '') + to
  let hash = ''
  const hashIdx = to.indexOf('#')
  if (~hashIdx) {
    hash = to.slice(hashIdx)
    to = to.slice(0, hashIdx)
  }
  if (to === from) return hash || (isDir(to) ? './' : path.basename(to))
  const relative = path.relative(path.dirname(from + '.'), to) || '.'
  return relative + (isDir(to) ? '/' + hash : hash)
}

function isDir (str) {
  return str.charAt(str.length - 1) === '/'
}
