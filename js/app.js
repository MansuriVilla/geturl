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

  // Drag and Drop Events
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
    handleFiles(event.dataTransfer.files)
  })

  // File Upload via Input
  uploadInput.addEventListener('change', function () {
    handleFiles(this.files)
  })

  // Select All/Unselect All Checkbox Logic
  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll(
      '.preview-img input[type="checkbox"]'
    )
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked
    })
  })

  // Delete Selected Images
  deleteBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll(
      '.preview-img input[type="checkbox"]:checked'
    )
    const deletedImagesCount = checkboxes.length

    checkboxes.forEach(checkbox => {
      const previewDiv = checkbox.closest('.preview-img')
      previewDiv.remove()
    })

    updateTotalImages()
    toggleFeatureTab()
    toggleNoPreviewMessage()

    if (deletedImagesCount > 0) {
      showNotification(`${deletedImagesCount} image(s) deleted!`, 3000)
    }
  })

  // Handle Uploaded Files
  function handleFiles (files) {
    let previewContainer = document.querySelector('.preview-container')

    if (!previewContainer) {
      previewContainer = document.createElement('div')
      previewContainer.classList.add('preview-container')
      imagePreview.appendChild(previewContainer)
    }

    Array.from(files).forEach(file => {
      if (!isValidImage(file)) {
        alert('Invalid file type. Only image files are allowed.')
        return
      }

      const reader = new FileReader()

      reader.onload = function (event) {
        const imgSrc = event.target.result
        const fileName = file.name

        noPreviewImage.style.display = 'none'
        noPreviewText.style.display = 'none'

        const imgPreviewDiv = createImagePreview(imgSrc, fileName, file)
        previewContainer.appendChild(imgPreviewDiv)
        observer.observe(imgPreviewDiv)
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

  // Create Image Preview DOM Structure
  function createImagePreview (imgSrc, fileName, file) {
    const imgPreviewDiv = document.createElement('div')
    imgPreviewDiv.classList.add('preview-img')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    imgPreviewDiv.appendChild(checkbox)

    const imgElement = document.createElement('img')
    imgElement.dataset.src = imgSrc
    imgElement.src =
      'data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAP///yH5BAEKAAEALAAAAAAQABAAAAM93I+pyJAkQAAOw==' // Placeholder
    imgElement.classList.add('lazy-load')
    imgPreviewDiv.appendChild(imgElement)

    const fileNameDiv = document.createElement('div')
    fileNameDiv.textContent = fileName
    imgPreviewDiv.appendChild(fileNameDiv)

    const imageDetails = getImageDetails(file, imgElement)
    const detailsDiv = document.createElement('div')
    detailsDiv.classList.add('image-details')
    detailsDiv.textContent = `Dimensions: ${imageDetails.width} x ${imageDetails.height} px | Size: ${imageDetails.size} KB`
    imgPreviewDiv.appendChild(detailsDiv)

    const copyUrlBtn = createCopyUrlButton(imgElement)
    imgPreviewDiv.appendChild(copyUrlBtn)

    return imgPreviewDiv
  }

  // Create Copy URL Button
  function createCopyUrlButton (imgElement) {
    const copyUrlBtn = document.createElement('button')
    copyUrlBtn.classList.add('copy-url-btn')

    const copyImg = document.createElement('img')
    copyImg.src = './images/copy-link-icon.png'
    copyImg.alt = 'Copy URL'
    copyUrlBtn.appendChild(copyImg)

    copyUrlBtn.addEventListener('click', () => {
      const url = imgElement.dataset.src
      if (url) {
        navigator.clipboard
          .writeText(url)
          .then(() => showNotification('Image URL copied to clipboard!', 3000))
          .catch(err => {
            console.error('Failed to copy: ', err)
            showNotification('Failed to copy the URL.', 3000)
          })
      }
    })

    return copyUrlBtn
  }

  // Get Image Details (Dimensions & Size)
  function getImageDetails (file, imgElement) {
    const imageDetails = {
      width: 0,
      height: 0,
      size: (file.size / 1024).toFixed(2)
    }

    const tempImg = new Image()
    tempImg.onload = function () {
      imageDetails.width = tempImg.width
      imageDetails.height = tempImg.height
      updateImageDetails(imageDetails, imgElement)
    }

    tempImg.src = URL.createObjectURL(file)
    return imageDetails
  }

  // Update Image Details
  function updateImageDetails (imageDetails, imgElement) {
    const imgPreviewDiv = imgElement.closest('.preview-img')
    const detailsDiv = imgPreviewDiv.querySelector('.image-details')
    detailsDiv.textContent = `Dimensions: ${imageDetails.width} x ${imageDetails.height} px | Size: ${imageDetails.size} KB`
  }

  // Display Notifications
  function showNotification (message, duration) {
    const notificationContainer = document.getElementById(
      'notificationContainer'
    )

    if (!notificationContainer) {
      console.error('Notification container not found!')
      return
    }

    const notification = document.createElement('div')
    notification.classList.add('notification')

    const progressBar = document.createElement('div')
    progressBar.classList.add('progress-bar')

    notification.textContent = message
    notification.appendChild(progressBar)
    notificationContainer.appendChild(notification)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      progressBar.style.width = progress + '%'
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => notification.remove(), 500)
      }
    }, duration / 10)

    setTimeout(() => notification.remove(), duration)
  }

  // Utility: Check if Valid Image File
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

  // Update Total Image Count
  function updateTotalImages () {
    const totalImages = document.querySelectorAll('.preview-img').length
    totalImgSpan.textContent = totalImages
  }

  // Toggle Feature Tab
  function toggleFeatureTab () {
    const totalImages = document.querySelectorAll('.preview-img').length
    topFeatureArea.style.display = totalImages > 0 ? 'flex' : 'none'
  }

  // Toggle "No Preview" Message
  function toggleNoPreviewMessage () {
    const previewContainer = document.querySelector('.preview-container')
    const totalImages = document.querySelectorAll('.preview-img').length
    const isEmpty = totalImages === 0

    noPreviewImage.style.display = isEmpty ? 'inline-block' : 'none'
    noPreviewText.style.display = isEmpty ? 'block' : 'none'
    if (previewContainer)
      previewContainer.style.display = isEmpty ? 'none' : 'flex'
  }

  // Lazy Load Observer
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const imgElement = entry.target.querySelector('img')
        if (entry.isIntersecting && imgElement?.dataset.src) {
          imgElement.src = imgElement.dataset.src
          observer.unobserve(entry.target)
        }
      })
    },
    { root: null, rootMargin: '200px', threshold: 0.5 }
  )

  // Modal Logic
  const modal = document.getElementById('customModal')
  const cancelBtn = document.getElementById('cancelBtn')
  const confirmBtn = document.getElementById('confirmBtn')
  let reloadPage = false

  window.addEventListener('beforeunload', event => {
    if (imagesUploaded && !reloadPage) {
      event.preventDefault()
      modal.style.display = 'flex'
      return (event.returnValue = '')
    }
  })

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  confirmBtn.addEventListener('click', () => {
    reloadPage = true
    modal.style.display = 'none'
    window.location.reload()
  })


  const ACCESS_KEY = '-M-eobT01N5ezliymd96b7k2TjzbcK7n5g8Ivy050fs';


  const heroSection = document.querySelector('.input-hero-section');
  
  
  async function fetchQuoteImage() {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=nature+quotes&client_id=${ACCESS_KEY}`
      );
      const data = await response.json();
  
      
      const imageUrl = data.urls.full;
  
      
      heroSection.style.backgroundImage = `url(${imageUrl})`;
    } catch (error) {
      console.error('Error fetching quote image:', error);
    }
  }
  
  
  fetchQuoteImage();







})
