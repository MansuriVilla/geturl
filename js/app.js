const uploadInput = document.getElementById('uploadInput');
const preview = document.getElementById('preview');

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