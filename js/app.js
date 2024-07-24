document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('uploadInput');
    const imagePreview = document.getElementById('imagePreview');
    let imagesUploaded = false;

    uploadInput.addEventListener('change', function() {
        const files = this.files;

        // Clear previous previews and initial message
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

                // Create copy URL button with image
                const copyUrlBtn = document.createElement('button');
                copyUrlBtn.classList.add('copy-url-btn');

                // Add image to the button
                const copyImg = document.createElement('img');
                copyImg.src = '../images/copy-link-icon.png'; // Replace with your image URL or path
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
});
