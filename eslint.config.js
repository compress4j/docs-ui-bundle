'use strict'

const neostandard = require('neostandard')

module.exports = [
  { ignores: ['src/js/vendor/', 'build/', 'public/', 'node_modules/'] },
  ...neostandard(),
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': [
        'error',
        { arrays: 'always-multiline', objects: 'always-multiline', imports: 'always-multiline', exports: 'always-multiline' },
      ],
      '@stylistic/max-len': ['warn', 120, 2],
      '@stylistic/spaced-comment': 'off',
    },
  },
]
