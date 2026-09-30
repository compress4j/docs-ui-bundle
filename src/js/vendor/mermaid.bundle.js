;(function () {
  'use strict'

  // gulp.d/tasks/build.js prepends mermaid's dist IIFE, which registers window.mermaid.
  var mermaid = window.mermaid

  var blocks = [].slice.call(document.querySelectorAll('pre code.language-mermaid'))
  if (!blocks.length) return

  var isDark = document.documentElement.classList.contains('dark')
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'strict',
  })

  blocks.forEach(function (code, idx) {
    var wrapper = code.closest('.listingblock') || code.parentNode.parentNode
    var div = document.createElement('div')
    div.className = 'mermaid'
    div.id = 'mermaid-diagram-' + idx
    div.textContent = code.textContent
    wrapper.parentNode.replaceChild(div, wrapper)
  })

  mermaid.run({ querySelector: '.mermaid' })
})()
