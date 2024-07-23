const uploadInput = document.getElementById('uploadInput');
const preview = document.getElementById('preview');
const copyUrlBtn = document.getElementById('copyUrlBtn');

uploadInput.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

copyUrlBtn.addEventListener('click', function() {
    const url = preview.src;
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