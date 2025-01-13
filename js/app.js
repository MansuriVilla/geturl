document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('uploadInput');
    const imagePreview = document.getElementById('imagePreview');
    const noPreviewImage = document.querySelector('.no-preview');
    const noPreviewText = document.querySelector('.image-preview p');
    let imagesUploaded = false;

    const body = document.body;

    
    body.addEventListener('dragover', (event) => {
        event.preventDefault();  
        body.classList.add('dragging'); 
    });

    body.addEventListener('dragleave', () => {
        body.classList.remove('dragging'); 
    });

    body.addEventListener('drop', (event) => {
        event.preventDefault();  
        body.classList.remove('dragging'); 

        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    
    uploadInput.addEventListener('change', function() {
        const files = this.files;
        handleFiles(files);
    });

    
    function handleFiles(files) {
        let previewContainer = document.querySelector('.preview-container');
        
        
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.classList.add('preview-container');
            imagePreview.appendChild(previewContainer);
        }

        
        Array.from(files).forEach(file => {
            if (!isValidImage(file)) {
                alert("Invalid file type. Only image files are allowed.");
                return; 
            }

            const reader = new FileReader();

            reader.onload = function(event) {
                const imgSrc = event.target.result;

                
                noPreviewImage.style.display = 'none';
                noPreviewText.style.display = 'none';

                
                const imgPreviewDiv = document.createElement('div');
                imgPreviewDiv.classList.add('preview-img');

                
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgPreviewDiv.appendChild(imgElement);

                
                const copyUrlBtn = document.createElement('button');
                copyUrlBtn.classList.add('copy-url-btn');

                const copyImg = document.createElement('img');
                copyImg.src = './images/copy-link-icon.png'; 
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
        });

        imagesUploaded = true;
        createNewImageButton(); 
    }

    
    function isValidImage(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
        return validTypes.includes(file.type); 
    }

    
    function createNewImageButton() {
        
        const existingButton = document.querySelector('.new-image-button');
        if (existingButton) return;

        const newImageButton = document.createElement('button');
        newImageButton.textContent = 'Add New Image';
        newImageButton.classList.add('new-image-button');

        
        newImageButton.addEventListener('click', () => {
            uploadInput.click(); 
        });

        
        imagePreview.appendChild(newImageButton);
    }

    
    window.addEventListener('beforeunload', function(event) {
        if (imagesUploaded) {
            event.preventDefault();
            event.returnValue = 'If you refresh the page, the uploaded images will be removed.';
        }
    });
});
