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

            // Create close button
            const closeBtn = document.createElement('div');
            closeBtn.classList.add('close-btn');
            closeBtn.innerHTML = 'x';
            closeBtn.addEventListener('click', function() {
                previewContainer.remove();
            });
            previewContainer.appendChild(closeBtn);

            // Append preview container to imagePreview div
            imagePreview.appendChild(previewContainer);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
});