'use strict'

const stylelint = require('stylelint')

module.exports = (files) => async () => {
  const { report, errored } = await stylelint.lint({ files, formatter: 'string' })
  if (report) console.log(report)
  if (errored) throw new Error('stylelint found errors')
}
