;(function () {
  'use strict'

  const articleSelector = 'article.doc'
  const sidebar = document.querySelector('aside.toc.sidebar')
  if (!sidebar) return
  const menu = sidebar.querySelector('.toc-menu') || createMenu()
  if (document.querySelector('body.-toc')) return menu.remove()
  const levels = Number.parseInt(sidebar.dataset.levels || 2, 10)
  if (levels < 0) return

  const article = document.querySelector(articleSelector)
  const headings = find(buildHeadingsSelector(levels), article.parentNode)
  if (!headings.length) return menu.remove()

  let lastActiveFragment
  const links = {}
  const list = headings.reduce(function (accum, heading) {
    const fragment = '#' + heading.id
    const link = document.createElement('a')
    link.textContent = heading.textContent
    link.href = fragment
    links[fragment] = link
    const listItem = document.createElement('li')
    listItem.dataset.level = Number.parseInt(heading.nodeName.slice(1), 10) - 1
    listItem.appendChild(link)
    accum.appendChild(listItem)
    return accum
  }, document.createElement('ul'))

  const title = document.createElement('h3')
  title.textContent = sidebar.dataset.title || 'Contents'
  menu.appendChild(title)
  menu.appendChild(list)

  embedToc()

  window.addEventListener('load', function () {
    onScroll()
    window.addEventListener('scroll', onScroll)
  })

  function createMenu () {
    const el = document.createElement('div')
    el.className = 'toc-menu'
    return el
  }

  function buildHeadingSelector (level) {
    if (!level) return [articleSelector, 'h1[id].sect0'].join('>')
    const selector = [articleSelector]
    for (let l = 1; l <= level; l++) selector.push((l === 2 ? '.sectionbody>' : '') + '.sect' + l)
    selector.push('h' + (level + 1) + '[id]')
    return selector.join('>')
  }

  function buildHeadingsSelector (maxLevel) {
    const selectors = []
    for (let level = 0; level <= maxLevel; level++) selectors.push(buildHeadingSelector(level))
    return selectors.join(',')
  }

  function embedToc () {
    const startOfContent = !document.getElementById('toc') && article.querySelector('h1.page ~ :not(.is-before-toc)')
    if (!startOfContent) return
    const embeddedToc = document.createElement('aside')
    embeddedToc.className = 'toc embedded'
    embeddedToc.appendChild(menu.cloneNode(true))
    startOfContent.parentNode.insertBefore(embeddedToc, startOfContent)
  }

  function isScrolledToBottom (scrolledBy) {
    return scrolledBy && window.innerHeight + scrolledBy + 2 >= document.documentElement.scrollHeight
  }

  function isAfterCeiling (heading, ceil, buffer) {
    return heading.getBoundingClientRect().top + getNumericStyleVal(heading, 'paddingTop') - buffer > ceil
  }

  function activateBottomFragments (ceil) {
    lastActiveFragment = Array.isArray(lastActiveFragment) ? lastActiveFragment : new Array(lastActiveFragment || 0)
    const activeFragments = []
    const lastIdx = headings.length - 1
    headings.forEach(function (heading, idx) {
      const fragment = '#' + heading.id
      if (idx === lastIdx || isAfterCeiling(heading, ceil, 0)) {
        activeFragments.push(fragment)
        if (!lastActiveFragment.includes(fragment)) links[fragment].classList.add('is-active')
      } else if (lastActiveFragment.includes(fragment)) {
        links[lastActiveFragment.shift()].classList.remove('is-active')
      }
    })
    list.scrollTop = list.scrollHeight - list.offsetHeight
    lastActiveFragment = activeFragments.length > 1 ? activeFragments : activeFragments[0]
  }

  function clearActiveFragments () {
    if (!Array.isArray(lastActiveFragment)) return
    lastActiveFragment.forEach(function (fragment) {
      links[fragment].classList.remove('is-active')
    })
    lastActiveFragment = undefined
  }

  function findActiveFragment (ceil, buffer) {
    let activeFragment
    headings.some(function (heading) {
      if (isAfterCeiling(heading, ceil, buffer)) return true
      activeFragment = '#' + heading.id
      return false
    })
    return activeFragment
  }

  function activateFragment (activeFragment) {
    if (activeFragment === lastActiveFragment) return
    if (lastActiveFragment) links[lastActiveFragment].classList.remove('is-active')
    const activeLink = links[activeFragment]
    activeLink.classList.add('is-active')
    if (list.scrollHeight > list.offsetHeight) {
      list.scrollTop = Math.max(0, activeLink.offsetTop + activeLink.offsetHeight - list.offsetHeight)
    }
    lastActiveFragment = activeFragment
  }

  function onScroll () {
    const scrolledBy = window.pageYOffset
    const ceil = article.offsetTop
    if (isScrolledToBottom(scrolledBy)) return activateBottomFragments(ceil)
    clearActiveFragments()
    const buffer = getNumericStyleVal(document.documentElement, 'fontSize') * 1.15
    const activeFragment = findActiveFragment(ceil, buffer)
    if (activeFragment) {
      activateFragment(activeFragment)
    } else if (lastActiveFragment) {
      links[lastActiveFragment].classList.remove('is-active')
      lastActiveFragment = undefined
    }
  }

  function find (selector, from) {
    return Array.from((from || document).querySelectorAll(selector))
  }

  function getNumericStyleVal (el, prop) {
    return Number.parseFloat(window.getComputedStyle(el)[prop])
  }
})()
