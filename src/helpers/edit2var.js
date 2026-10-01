'use strict'

const commitsFromEdit = (url) => url.replace(/\/edit\//, '/commits/')

const HOSTS = [
  {
    marker: '://github.com/',
    issue: (url) => url.replace(/\/edit\/(\w+)\/(.*)$/, '/issues/new?title=[$1] Doc issue in file $2'),
    history: commitsFromEdit,
  },
  {
    marker: '://pagure.io/',
    issue: (url) => url.replace(/\/blob\/(\w+)\/f\/(.*)$/, '/new_issue?title=[$1] Doc issue in file $2'),
    history: (url) => {
      const m = /\/blob\/(\w+)\/f\/(.*)$/.exec(url)
      return m ? `${url.slice(0, m.index)}/history/${m[2]}?identifier=${m[1]}` : false
    },
  },
  {
    marker: '://gitlab.com/',
    issue: (url) => url.replace(/\/edit\/(\w+)\/(.*)$/, '/issues/new?issue[title]=[$1] Doc issue in file $2'),
    history: commitsFromEdit,
  },
  {
    marker: '://forge.fedoraproject.org/',
    issue: (url) => url.replace(/\/src\/branch\/(\w+)\/(.*)$/, '/issues/new?title=[$1] Doc issue in file $2'),
    history: (url) => url.replace(/\/src\//, '/commits/'),
  },
]

module.exports = function edit2var (editUrl, type) {
  if (!editUrl || !type) return false
  const host = HOSTS.find(({ marker }) => editUrl.includes(marker))
  const build = host?.[type]
  return typeof build === 'function' ? build(editUrl) : false
}
