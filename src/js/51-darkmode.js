;(function () {
  'use strict'

  var toggle = document.querySelector('#themeSwitch')
  var ls = window.localStorage
  if (!toggle) return

  toggle.addEventListener('click', function (e) {
    toggleTheme()
    // don't let this event get smothered
    e.stopPropagation()
  })

  function toggleTheme () {
    if (ls.darkmode === 'true') {
      // switch to light
      ls.darkmode = false
    } else {
      // switch to dark
      ls.darkmode = true
    }
    applyTheme()
  }

  function applyTheme () {
    if (ls.darkmode === 'true') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize with system preference if not set
  if (!('darkmode' in ls)) {
    ls.darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  applyTheme()
})()
