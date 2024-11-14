document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('uploadInput');
  const imagePreview = document.getElementById('imagePreview');
  let imagesUploaded = false;

  // Adding event listeners for drag events on body
  const body = document.body;

  body.addEventListener('dragover', (event) => {
      event.preventDefault();  // Necessary to allow dropping
      body.classList.add('dragging'); // Change cursor when dragging
  });

  body.addEventListener('dragleave', () => {
      body.classList.remove('dragging'); // Reset cursor when drag leaves
  });

  body.addEventListener('drop', (event) => {
      event.preventDefault();  // Prevent default behavior (file opening)
      body.classList.remove('dragging'); // Reset cursor

      // Handle the dropped files
      const files = event.dataTransfer.files;
      handleFiles(files);
  });

  // File input change event to handle uploads
  uploadInput.addEventListener('change', function() {
      const files = this.files;
      handleFiles(files);
  });

  // Function to handle file uploads and image previews
  function handleFiles(files) {
      // Clear previous previews and initial message
      imagePreview.innerHTML = '';

      let previewContainer = document.createElement('div');
      previewContainer.classList.add('preview-container');
      imagePreview.appendChild(previewContainer);

      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();

          reader.onload = function(event) {
              const imgSrc = event.target.result;

              // Create image preview div
              const imgPreviewDiv = document.createElement('div');
              imgPreviewDiv.classList.add('preview-img');

              // Create image element
              const imgElement = document.createElement('img');
              imgElement.src = imgSrc;
              imgPreviewDiv.appendChild(imgElement);

              // Create copy URL button with image
              const copyUrlBtn = document.createElement('button');
              copyUrlBtn.classList.add('copy-url-btn');

              const copyImg = document.createElement('img');
              copyImg.src = './images/copy-link-icon.png'; // Your copy icon URL
              copyImg.alt = 'Copy URL';
              copyUrlBtn.appendChild(copyImg);

              copyUrlBtn.addEventListener('click', function() {
                  const url = imgElement.src;
                  if (url) {
                      navigator.clipboard.writeText(url)
                          .then(() => {
                              alert('Image URL copied to clipboard!');
                          })
                          .catch(err => {
                              console.error('Failed to copy: ', err);
                          });
                  }
              });

              imgPreviewDiv.appendChild(copyUrlBtn);
              previewContainer.appendChild(imgPreviewDiv);
          };

          if (file) {
              reader.readAsDataURL(file);
          }
      }

      imagesUploaded = true;
  }

  // Add beforeunload event listener to warn the user before leaving the page
  window.addEventListener('beforeunload', function(event) {
      if (imagesUploaded) {
          event.preventDefault();
          event.returnValue = 'If you refresh the page, the uploaded images will be removed.';
      }
  });
});
