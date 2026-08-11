/* Gallery: renders the masonry grid from PHOTOS (js/photos.js), builds the
   category filter buttons, and drives the lightbox. No dependencies. */

;(function () {
  const grid = document.querySelector('[data-gallery]')
  if (!grid || typeof PHOTOS === 'undefined') return

  const filterBar = document.querySelector('[data-filters]')
  const lightbox = document.querySelector('[data-lightbox]')
  const lightboxImg = lightbox.querySelector('[data-lightbox-image]')
  const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]')
  const lightboxCounter = lightbox.querySelector('[data-lightbox-counter]')

  const GRID_WIDTHS = [400, 800, 1200]
  const GRID_SIZES = '(min-width: 56em) 30vw, (min-width: 34em) 46vw, 96vw'

  let activeCategory = 'all'
  let visiblePhotos = []
  let currentIndex = 0
  let lastFocused = null

  /* --- Image sources ----------------------------------------------------- */

  function picsumUrl(photo, width) {
    const height = Math.round((width * photo.height) / photo.width)
    return 'https://picsum.photos/id/' + photo.picsum + '/' + width + '/' + height
  }

  // Returns { src, srcset } for a photo. Placeholder entries (with a `picsum`
  // id) get generated sizes; your own photos use `src` plus an optional
  // `srcset` array of [url, width] pairs from photos.js.
  function sources(photo) {
    if (photo.picsum) {
      const widths = GRID_WIDTHS.filter((w) => w <= photo.width)
      return {
        src: picsumUrl(photo, widths[widths.length - 1]),
        srcset: widths.map((w) => picsumUrl(photo, w) + ' ' + w + 'w').join(', '),
      }
    }
    return {
      src: photo.src,
      srcset: Array.isArray(photo.srcset)
        ? photo.srcset.map(([url, w]) => url + ' ' + w + 'w').join(', ')
        : '',
    }
  }

  /* --- Filters ----------------------------------------------------------- */

  function categories() {
    return ['all', ...new Set(PHOTOS.map((p) => p.category))]
  }

  function renderFilters() {
    if (!filterBar) return
    filterBar.innerHTML = ''
    for (const category of categories()) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'filter-btn'
      btn.textContent = category === 'all' ? 'All' : category
      btn.setAttribute('aria-pressed', String(category === activeCategory))
      btn.addEventListener('click', () => {
        activeCategory = category
        renderFilters()
        renderGrid()
      })
      filterBar.appendChild(btn)
    }
  }

  /* --- Grid --------------------------------------------------------------- */

  function renderGrid() {
    visiblePhotos =
      activeCategory === 'all' ? PHOTOS.slice() : PHOTOS.filter((p) => p.category === activeCategory)

    grid.innerHTML = ''

    if (visiblePhotos.length === 0) {
      const empty = document.createElement('p')
      empty.className = 'gallery-empty'
      empty.textContent = 'No photos in this category yet.'
      grid.appendChild(empty)
      return
    }

    visiblePhotos.forEach((photo, index) => {
      const { src, srcset } = sources(photo)

      const img = document.createElement('img')
      img.src = src
      if (srcset) {
        img.srcset = srcset
        img.sizes = GRID_SIZES
      }
      img.alt = photo.alt
      img.width = photo.width
      img.height = photo.height
      img.decoding = 'async'
      // The first few images are above the fold; lazy-load the rest.
      if (index >= 3) img.loading = 'lazy'

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.setAttribute('aria-label', 'View photo: ' + photo.alt)
      btn.addEventListener('click', () => openLightbox(index))
      btn.appendChild(img)

      const item = document.createElement('div')
      item.className = 'masonry-item'
      item.appendChild(btn)
      grid.appendChild(item)
    })
  }

  /* --- Lightbox ----------------------------------------------------------- */

  function showPhoto(index) {
    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length
    const photo = visiblePhotos[currentIndex]
    const { src, srcset } = sources(photo)

    lightboxImg.src = src
    if (srcset) {
      lightboxImg.srcset = srcset
      lightboxImg.sizes = '100vw'
    } else {
      lightboxImg.removeAttribute('srcset')
      lightboxImg.removeAttribute('sizes')
    }
    lightboxImg.alt = photo.alt
    lightboxCaption.textContent = photo.caption || ''
    lightboxCounter.textContent = currentIndex + 1 + ' / ' + visiblePhotos.length
  }

  function openLightbox(index) {
    lastFocused = document.activeElement
    showPhoto(index)
    lightbox.showModal()
    lightbox.querySelector('.lightbox-close').focus()
  }

  function closeLightbox() {
    lightbox.close()
  }

  lightbox.addEventListener('close', () => {
    if (lastFocused) lastFocused.focus()
  })

  // Close when clicking the backdrop (outside the figure/controls).
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox-inner')) {
      closeLightbox()
    }
  })

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showPhoto(currentIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPhoto(currentIndex - 1)
    }
    // Escape is handled natively by <dialog>.
  })

  lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => showPhoto(currentIndex - 1))
  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => showPhoto(currentIndex + 1))
  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox)

  /* --- Init --------------------------------------------------------------- */

  renderFilters()
  renderGrid()
})()
