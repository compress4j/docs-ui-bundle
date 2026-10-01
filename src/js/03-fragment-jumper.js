;(function () {
  'use strict'

  const article = document.querySelector('article.doc')
  const toolbar = document.querySelector('.toolbar')

  function decodeFragment (hash) {
    return hash && (~hash.indexOf('%') ? decodeURIComponent(hash) : hash).slice(1)
  }

  function computePosition (el, sum) {
    return article.contains(el) ? computePosition(el.offsetParent, el.offsetTop + sum) : sum
  }

  function findTarget (hash) {
    const fragment = decodeFragment(hash)
    return fragment ? document.getElementById(fragment) : null
  }

  function jumpToAnchor (e) {
    if (e) {
      if (e.altKey || e.ctrlKey) return
      window.location.hash = '#' + this.id
      e.preventDefault()
    }
    window.scrollTo(0, computePosition(this, 0) - toolbar.getBoundingClientRect().bottom)
  }

  window.addEventListener('load', function jumpOnLoad (e) {
    const target = findTarget(window.location.hash)
    if (target) {
      jumpToAnchor.bind(target)()
      setTimeout(jumpToAnchor.bind(target), 0)
    }
    window.removeEventListener('load', jumpOnLoad)
  })

  Array.from(document.querySelectorAll('a[href^="#"]')).forEach(function (el) {
    const target = findTarget(el.hash)
    if (target) {
      el.addEventListener('click', jumpToAnchor.bind(target))
    }
  })
})()
