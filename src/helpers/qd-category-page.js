'use strict'

module.exports = function qdCategoryPage (category, { data: { root } }) {
  const { contentCatalog } = root
  return contentCatalog.getPages().find(
    (page) =>
      page.src.component === 'quick-docs' &&
      page.asciidoc.attributes &&
      page.asciidoc.attributes['page-layout'] === 'category' &&
      page.asciidoc.attributes['page-category'] === category
  )
}
