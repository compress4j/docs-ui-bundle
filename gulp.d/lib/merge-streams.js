'use strict'

const { once } = require('events')
const { PassThrough, Readable } = require('stream')

const iterable = (source) =>
  Symbol.asyncIterator in source ? source : new Readable({ objectMode: true }).wrap(source)

// vinyl-fs 4 streams (streamx) always end their pipe destination, so merge-stream ends after the first source.
module.exports = (...sources) => {
  const merged = new PassThrough({ objectMode: true })
  const forward = async (source) => {
    for await (const chunk of iterable(source)) if (!merged.write(chunk)) await once(merged, 'drain')
  }
  Promise.all(sources.map(forward)).then(() => merged.end(), (err) => merged.destroy(err))
  return merged
}
