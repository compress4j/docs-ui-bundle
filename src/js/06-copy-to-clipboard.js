;(function () {
  'use strict'

  const CMD_RX = /^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm
  const LINE_CONTINUATION = '\\\n'

  const config = (document.getElementById('site-script') || { dataset: {} }).dataset
  const uiRootPath = config.uiRootPath == null ? '.' : config.uiRootPath
  const svgAs = config.svgAs
  const supportsCopy = window.navigator.clipboard

  Array.from(document.querySelectorAll('.doc pre.highlight, .doc .literalblock pre')).forEach(function (pre) {
    const parts = pre.classList.contains('highlight') ? fromHighlight(pre) : fromLiteral(pre)
    if (!parts) return
    const { code, lang } = parts
    const toolbox = createElement('div', 'source-toolbox')
    if (lang) toolbox.appendChild(lang)
    const copy = supportsCopy ? createCopyButton() : undefined
    if (copy) toolbox.appendChild(copy)
    pre.parentNode.appendChild(toolbox)
    if (copy) copy.addEventListener('click', writeToClipboard.bind(copy, code))
  })

  function createElement (tagName, className) {
    const el = document.createElement(tagName)
    el.className = className
    return el
  }

  function fromHighlight (pre) {
    const code = pre.querySelector('code')
    const language = code.dataset.lang
    if (!language || language === 'console') return { code }
    const lang = createElement('span', 'source-lang')
    lang.appendChild(document.createTextNode(language))
    return { code, lang }
  }

  function fromLiteral (pre) {
    if (!pre.innerText.startsWith('$ ')) return undefined
    const block = pre.parentNode.parentNode
    block.classList.remove('literalblock')
    block.classList.add('listingblock')
    pre.classList.add('highlightjs', 'highlight')
    const code = createElement('code', 'language-console hljs')
    code.dataset.lang = 'console'
    code.appendChild(pre.firstChild)
    pre.appendChild(code)
    return { code }
  }

  function createIcon () {
    if (svgAs === 'svg') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('class', 'copy-icon')
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      use.setAttribute('href', uiRootPath + '/img/clipboard.svg')
      svg.appendChild(use)
      return svg
    }
    const img = document.createElement('img')
    img.src = uiRootPath + '/img/clipboard.svg'
    img.alt = 'copy icon'
    img.className = 'copy-icon'
    return img
  }

  function createCopyButton () {
    const copy = createElement('button', 'copy-button')
    copy.setAttribute('title', 'Copy to clipboard')
    copy.appendChild(createIcon())
    const toast = createElement('span', 'copy-toast')
    toast.appendChild(document.createTextNode('Copied!'))
    copy.appendChild(toast)
    return copy
  }

  function trimStartSpaces (str) {
    let start = 0
    while (str.charAt(start) === ' ') start++
    return str.slice(start)
  }

  function trimEndSpaces (str) {
    let end = str.length
    while (end > 0 && str.charAt(end - 1) === ' ') end--
    return str.slice(0, end)
  }

  function joinContinuations (text) {
    return text.split(LINE_CONTINUATION).reduce(function (joined, part, idx) {
      if (idx === 0) return part
      const spaced = joined.endsWith(' ') || part.startsWith(' ')
      return trimEndSpaces(joined) + (spaced ? ' ' : '') + trimStartSpaces(part)
    }, '')
  }

  function extractCommands (text) {
    const cmds = []
    let m = CMD_RX.exec(text)
    while (m) {
      cmds.push(joinContinuations(m[1]))
      m = CMD_RX.exec(text)
    }
    return cmds.join(' && ')
  }

  function writeToClipboard (code) {
    let text = code.innerText.split('\n').map(trimEndSpaces).join('\n')
    if (code.dataset.lang === 'console' && text.startsWith('$ ')) text = extractCommands(text)
    window.navigator.clipboard.writeText(text).then(
      function () {
        this.classList.add('clicked')
        this.offsetHeight // eslint-disable-line no-unused-expressions
        this.classList.remove('clicked')
      }.bind(this),
      function () {}
    )
  }
})()
