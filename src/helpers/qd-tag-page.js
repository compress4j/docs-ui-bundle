'use strict'

module.exports = function qdTagPage (tag, { data: { root } }) {
  const { contentCatalog } = root
  return contentCatalog.getPages().find(
    (page) =>
      page.src.component === 'quick-docs' &&
      page.asciidoc.attributes?.['page-layout'] === 'category' &&
      page.asciidoc.attributes['page-tag'] === tag
  )
}
