'use strict'

module.exports = (editUrl, type) => {
  if (!editUrl || !type) return false
  if (editUrl.includes('://github.com/')) {
    if (type === 'issue') return editUrl.replace(/\/edit\/(\w+)\/(.*)$/, '/issues/new?title=[$1] Doc issue in file $2')
    if (type === 'history') return editUrl.replace(/\/edit\//, '/commits/')
  }
  if (editUrl.includes('://pagure.io/')) {
    if (type === 'issue') {
      return editUrl.replace(/\/blob\/(\w+)\/f\/(.*)$/, '/new_issue?title=[$1] Doc issue in file $2')
    }
    if (type === 'history') {
      const m = editUrl.match(/(.*)\/blob\/(\w+)\/f\/(.*)$/)
      return `${m[1]}/history/${m[3]}?identifier=${m[2]}`
    }
  }
  if (editUrl.includes('://gitlab.com/')) {
    if (type === 'issue') {
      return editUrl.replace(/\/edit\/(\w+)\/(.*)$/, '/issues/new?issue[title]=[$1] Doc issue in file $2')
    }
    if (type === 'history') return editUrl.replace(/\/edit\//, '/commits/')
  }
  if (editUrl.includes('://forge.fedoraproject.org/')) {
    if (type === 'issue') return editUrl.replace(/\/src\/branch\/(\w+)\/(.*)$/, '/issues/new?title=[$1] Doc issue in file $2')
    if (type === 'history') return editUrl.replace(/\/src\//, '/commits/')
  }

  return false
}
