;(function () {
  'use strict'

  var hljs = require('highlight.js/lib/core')
  // highlight.js >=11 highlights textContent only, so callout markup inside a code
  // block is detached before highlighting and re-inserted at its text offset after.
  var detached = new WeakMap()
  hljs.addPlugin({
    'before:highlightElement': function (context) {
      var offset = 0
      var nodes = []
      ;[].slice.call(context.el.childNodes).forEach(function (node) {
        if (node.nodeType === 3) return (offset += node.nodeValue.length)
        nodes.push({ offset: offset, node: node })
        context.el.removeChild(node)
      })
      detached.set(context.el, nodes)
    },
    'after:highlightElement': function (context) {
      ;(detached.get(context.el) || []).reverse().forEach(function (entry) {
        insertAtOffset(context.el, entry.offset, entry.node)
      })
    },
  })

  function insertAtOffset (root, offset, node) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    var position = 0
    var text
    while ((text = walker.nextNode())) {
      if (offset <= position + text.nodeValue.length) {
        return text.parentNode.insertBefore(node, text.splitText(offset - position))
      }
      position += text.nodeValue.length
    }
    root.appendChild(node)
  }

  hljs.registerLanguage('asciidoc', require('highlight.js/lib/languages/asciidoc'))
  hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
  hljs.registerLanguage('clojure', require('highlight.js/lib/languages/clojure'))
  hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
  // highlight.js >=10 renamed the language file cs.js -> csharp.js; 'cs' stays
  // the registered name since that's the identifier asciidoctor emits for C#.
  hljs.registerLanguage('cs', require('highlight.js/lib/languages/csharp'))
  hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
  hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'))
  hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'))
  hljs.registerLanguage('elixir', require('highlight.js/lib/languages/elixir'))
  hljs.registerLanguage('go', require('highlight.js/lib/languages/go'))
  hljs.registerLanguage('groovy', require('highlight.js/lib/languages/groovy'))
  hljs.registerLanguage('haskell', require('highlight.js/lib/languages/haskell'))
  hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
  hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
  hljs.registerLanguage('kotlin', require('highlight.js/lib/languages/kotlin'))
  hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
  hljs.registerLanguage('nix', require('highlight.js/lib/languages/nix'))
  hljs.registerLanguage('objectivec', require('highlight.js/lib/languages/objectivec'))
  hljs.registerLanguage('perl', require('highlight.js/lib/languages/perl'))
  hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
  hljs.registerLanguage('properties', require('highlight.js/lib/languages/properties'))
  hljs.registerLanguage('puppet', require('highlight.js/lib/languages/puppet'))
  hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
  hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'))
  hljs.registerLanguage('rust', require('highlight.js/lib/languages/rust'))
  hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'))
  hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'))
  hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
  hljs.registerLanguage('swift', require('highlight.js/lib/languages/swift'))
  hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
  hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
  hljs.registerLanguage('rpm-specfile', require('./rpm-specfile.bundle.js').definer)
  ;[].slice.call(document.querySelectorAll('pre code.hljs')).forEach(function (node) {
    hljs.highlightElement(node)
  })
})()
