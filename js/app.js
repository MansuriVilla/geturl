document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('uploadInput')
  const imagePreview = document.getElementById('imagePreview')
  const noPreviewImage = document.querySelector('.no-preview')
  const noPreviewText = document.querySelector('.image-preview p')
  const totalImgSpan = document.getElementById('total_img')
  const selectAllCheckbox = document.getElementById('selet_all--img')
  const deleteBtn = document.getElementById('delete_img')
  const topFeatureArea = document.querySelector('.top_feature--area')
  let imagesUploaded = false

  // Initially hide the feature tab area
  topFeatureArea.style.display = 'none'

  const body = document.body

  body.addEventListener('dragover', event => {
    event.preventDefault()
    body.classList.add('dragging')
  })

  body.addEventListener('dragleave', () => {
    body.classList.remove('dragging')
  })

  body.addEventListener('drop', event => {
    event.preventDefault()
    body.classList.remove('dragging')

    const files = event.dataTransfer.files
    handleFiles(files)
  })

  uploadInput.addEventListener('change', function () {
    const files = this.files
    handleFiles(files)
  })

  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll(
      '.preview-img input[type="checkbox"]'
    )
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked
    })
  })

  deleteBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll(
      '.preview-img input[type="checkbox"]:checked'
    )
    checkboxes.forEach(checkbox => {
      const previewDiv = checkbox.closest('.preview-img')
      previewDiv.remove()
    })
    updateTotalImages()
    toggleFeatureTab()
    toggleNoPreviewMessage()
  })

  function handleFiles (files) {
    let previewContainer = document.querySelector('.preview-container')

    // Create the preview container if it doesn't exist
    if (!previewContainer) {
      previewContainer = document.createElement('div')
      previewContainer.classList.add('preview-container')
      imagePreview.appendChild(previewContainer)
    }

    const totalImages = document.querySelectorAll('.preview-img').length

    Array.from(files).forEach(file => {
      if (!isValidImage(file)) {
        alert('Invalid file type. Only image files are allowed.')
        return
      }

      const reader = new FileReader()

      reader.onload = function (event) {
        const imgSrc = event.target.result

        noPreviewImage.style.display = 'none'
        noPreviewText.style.display = 'none'

        const imgPreviewDiv = document.createElement('div')
        imgPreviewDiv.classList.add('preview-img')

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        imgPreviewDiv.appendChild(checkbox)

        const imgElement = document.createElement('img')
        imgElement.src = imgSrc
        imgPreviewDiv.appendChild(imgElement)

        // Check if there are already images in the preview container
        if (totalImages > 0) {
          imgPreviewDiv.classList.add('new')  // Add a "new" class to newly added images
        }

        const copyUrlBtn = document.createElement('button')
        copyUrlBtn.classList.add('copy-url-btn')

        const copyImg = document.createElement('img')
        copyImg.src = './images/copy-link-icon.png'
        copyImg.alt = 'Copy URL'
        copyUrlBtn.appendChild(copyImg)

        copyUrlBtn.addEventListener('click', function () {
          const url = imgElement.src
          if (url) {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                alert('Image URL copied to clipboard!')
              })
              .catch(err => {
                console.error('Failed to copy: ', err)
              })
          }
        })

        imgPreviewDiv.appendChild(copyUrlBtn)

        previewContainer.appendChild(imgPreviewDiv)
        updateTotalImages()
        toggleFeatureTab()
        toggleNoPreviewMessage()
      }

      if (file) {
        reader.readAsDataURL(file)
      }
    })

    imagesUploaded = true
    toggleFeatureTab()
    toggleNoPreviewMessage()
  }

  function isValidImage (file) {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ]
    return validTypes.includes(file.type)
  }

  function updateTotalImages () {
    const totalImages = document.querySelectorAll('.preview-img').length
    totalImgSpan.textContent = totalImages
  }

  function toggleFeatureTab () {
    const totalImages = document.querySelectorAll('.preview-img').length
    if (totalImages > 0) {
      topFeatureArea.style.display = 'flex'
    } else {
      topFeatureArea.style.display = 'none'
    }
  }

  function toggleNoPreviewMessage () {
    const previewContainer = document.querySelector('.preview-container')
    const totalImages = document.querySelectorAll('.preview-img').length
    if (totalImages === 0) {
      noPreviewImage.style.display = 'inline-block'
      noPreviewText.style.display = 'block'
      if (previewContainer) {
        previewContainer.style.display = 'none'
      }
    } else {
      noPreviewImage.style.display = 'none'
      noPreviewText.style.display = 'none'
      if (previewContainer) {
        previewContainer.style.display = 'flex'
      }
    }
  }

  window.addEventListener('beforeunload', function (event) {
    if (imagesUploaded) {
      event.preventDefault()
      event.returnValue =
        'If you refresh the page, the uploaded images will be removed.'
    }
  })
})
