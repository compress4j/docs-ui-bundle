'use strict'

module.exports = (editUrl, options) => {
  var ret = ''
  if (!editUrl) return ret
  let howtos = null
  if (options.data.root.site.keys) {
    howtos = options.data.root.site.keys.howtos
  }
  if (!howtos) return ret
  howtos = JSON.parse(howtos)

  let howto = ''
  if (editUrl.includes('://github.com/')) {
    if (howtos.github) howto = howtos.github
  }
  if (editUrl.includes('://pagure.io/')) {
    if (howtos.gitlab) howto = howtos.pagure
  }
  if (editUrl.includes('://gitlab.com/')) {
    if (howtos.gitlab) howto = howtos.gitlab
  }

  if (howto) {
    const page = options.data.root.contentCatalog.resolvePage(howto.link)
    if (page) ret = options.fn({ title: howto.title, link: page.pub.url })
  }

  return ret
}
