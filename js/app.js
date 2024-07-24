const uploadInput = document.getElementById('uploadInput');
const imagePreview = document.getElementById('imagePreview');
let imagesUploaded = false;

uploadInput.addEventListener('change', function() {
    const files = this.files;

    // Clear previous previews
    imagePreview.innerHTML = '';

    // Create main preview container if not exists
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

            // Create copy URL button
            const copyUrlBtn = document.createElement('div');
            copyUrlBtn.classList.add('copy-url-btn');
            copyUrlBtn.innerHTML = 'Copy Image URL';
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

            // Append image preview div to main preview container
            previewContainer.appendChild(imgPreviewDiv);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    // Set the flag indicating that images have been uploaded
    imagesUploaded = true;
});

// Add beforeunload event listener to warn the user before leaving the page
window.addEventListener('beforeunload', function(event) {
    if (imagesUploaded) {
        event.preventDefault();
        event.returnValue = 'If you refresh the page, the uploaded images will be removed.';
    }
});
