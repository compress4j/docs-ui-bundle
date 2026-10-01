'use strict'

module.exports = function tokenize (value) {
  return value.trim().split(',').map((v) => v.trim().toLowerCase())
}
