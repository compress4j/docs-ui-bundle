'use strict'

module.exports = (tag, { data: { root } }) => {
  const { contentCatalog } = root
  return contentCatalog.getPages()
    .filter((page) =>
      page.src.component === 'quick-docs' &&
      page.asciidoc.attributes &&
      page.asciidoc.attributes['page-layout'] === 'category' &&
      page.asciidoc.attributes['page-tag'] === tag
    )[0]
}
