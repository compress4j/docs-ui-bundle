;(function () {
  'use strict'

  var DataTable = require('datatables.net')
  ;[].slice.call(document.querySelectorAll('table.datatable')).forEach(function (node) {
    new DataTable(node, { // eslint-disable-line no-new
      searching: node.classList.contains('dt-search'),
      paging: node.classList.contains('dt-paging'),
    })
  })
})()
