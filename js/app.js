const uploadInput = document.getElementById('uploadInput');
const imagePreview = document.getElementById('imagePreview');

uploadInput.addEventListener('change', function() {
    const files = this.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const imgSrc = event.target.result;

            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.classList.add('preview-container');

            // Create image element
            const imgElement = document.createElement('img');
            imgElement.src = imgSrc;
            previewContainer.appendChild(imgElement);

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
            previewContainer.appendChild(copyUrlBtn);

            // Append preview container to imagePreview div
            imagePreview.appendChild(previewContainer);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
});