;(function () {
  'use strict'

  const SECT_CLASS_RX = /^sect(\d)$/

  const navContainer = document.querySelector('.nav-container')
  if (!navContainer) return
  const navToggle = document.querySelector('.nav-toggle')

  navToggle.addEventListener('click', showNav)
  navContainer.addEventListener('click', trapEvent)

  const menuPanel = navContainer.querySelector('[data-panel=menu]')
  if (!menuPanel) return
  const explorePanel = navContainer.querySelector('[data-panel=explore]')
  const nav = navContainer.querySelector('.nav')

  let currentPageItem = menuPanel.querySelector('.is-current-page')
  const originalPageItem = currentPageItem
  if (currentPageItem) {
    activateCurrentPath(currentPageItem)
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
  } else {
    menuPanel.scrollTop = 0
  }

  find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
    const li = btn.parentElement
    btn.addEventListener('click', toggleActive.bind(li))
    const navItemSpan = findNextElement(btn, '.nav-text')
    if (navItemSpan) {
      navItemSpan.style.cursor = 'pointer'
      navItemSpan.addEventListener('click', toggleActive.bind(li))
    }
  })

  if (explorePanel) {
    explorePanel.querySelector('.context').addEventListener('click', function () {
      // NOTE logic assumes there are only two panels
      find(nav, '[data-panel]').forEach(function (panel) {
        panel.classList.toggle('is-active')
      })
    })
  }

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function decodeHash (hash) {
    return hash.includes('%') ? decodeURIComponent(hash) : hash
  }

  function sectionId (el) {
    if (el.id) return el.id
    return SECT_CLASS_RX.test(el.className) ? el.firstElementChild?.id : undefined
  }

  function findNavLinkByAncestor (targetNode) {
    const ceiling = document.querySelector('article.doc')
    let current = targetNode.parentNode
    while (current && current !== ceiling) {
      const id = sectionId(current)
      const navLink = id && menuPanel.querySelector('.nav-link[href="#' + id + '"]')
      if (navLink) return navLink
      current = current.parentNode
    }
  }

  function findNavLink (hash) {
    const direct = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
    if (direct) return direct
    const targetNode = document.getElementById(hash.slice(1))
    return targetNode ? findNavLinkByAncestor(targetNode) : undefined
  }

  function onHashChange () {
    const hash = window.location.hash
    let navLink = hash ? findNavLink(decodeHash(hash)) : undefined
    let navItem
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      navItem = originalPageItem
      navLink = navItem.querySelector('.nav-link')
    } else {
      return
    }
    if (navItem === currentPageItem) return
    find(menuPanel, '.nav-item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
    })
    navItem.classList.add('is-current-page')
    currentPageItem = navItem
    activateCurrentPath(navItem)
    scrollItemToMidpoint(menuPanel, navLink)
  }

  if (menuPanel.querySelector('.nav-link[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }

  function activateCurrentPath (navItem) {
    let ancestor = navItem.parentNode
    let ancestorClasses = ancestor.classList
    while (!ancestorClasses.contains('nav-menu')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
        ancestorClasses.add('is-active', 'is-current-path')
      }
      ancestor = ancestor.parentNode
      ancestorClasses = ancestor.classList
    }
    navItem.classList.add('is-active')
  }

  function toggleActive () {
    if (this.classList.toggle('is-active')) {
      const padding = Number.parseFloat(window.getComputedStyle(this).marginTop)
      const rect = this.getBoundingClientRect()
      const menuPanelRect = menuPanel.getBoundingClientRect()
      const overflowY = (rect.bottom - menuPanelRect.top - menuPanelRect.height + padding).toFixed()
      if (overflowY > 0) menuPanel.scrollTop += Math.min((rect.top - menuPanelRect.top - padding).toFixed(), overflowY)
    }
  }

  function showNav (e) {
    if (navToggle.classList.contains('is-active')) return hideNav(e)
    trapEvent(e)
    const html = document.documentElement
    html.classList.add('is-clipped--nav')
    navToggle.classList.add('is-active')
    navContainer.classList.add('is-active')
    const bounds = nav.getBoundingClientRect()
    const expectedHeight = window.innerHeight - Math.round(bounds.top)
    if (Math.round(bounds.height) !== expectedHeight) nav.style.height = expectedHeight + 'px'
    html.addEventListener('click', hideNav)
  }

  function hideNav (e) {
    trapEvent(e)
    const html = document.documentElement
    html.classList.remove('is-clipped--nav')
    navToggle.classList.remove('is-active')
    navContainer.classList.remove('is-active')
    html.removeEventListener('click', hideNav)
  }

  function trapEvent (e) {
    e.stopPropagation()
  }

  function scrollItemToMidpoint (panel, el) {
    const rect = panel.getBoundingClientRect()
    let effectiveHeight = rect.height
    const navStyle = window.getComputedStyle(nav)
    if (navStyle.position === 'sticky') effectiveHeight -= rect.top - Number.parseFloat(navStyle.top)
    panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)
  }

  function find (from, selector) {
    return Array.from(from.querySelectorAll(selector))
  }

  function findNextElement (from, selector) {
    const el = from.nextElementSibling
    if (!el || !selector) return el
    return el.matches(selector) && el
  }
})()
