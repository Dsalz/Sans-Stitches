const addImageBtn = document.getElementById('add-image-btn');
const addImageInput = document.getElementById('add-image-input');
const imagePreviewDiv = document.getElementById('image-preview-div');
const fileArray = [];


const displayImage = (file) => {
  const imgReader = new FileReader();
  imgReader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    imagePreviewDiv.insertAdjacentElement('beforeend', img);
  };
  imgReader.readAsDataURL(file);
};

addImageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addImageInput.dispatchEvent(new MouseEvent('click'))
})

addImageInput.addEventListener('change', () => {
    fileArray.push(addImageInput.files[0]);
    displayImage(addImageInput.files[0]);
})

const getImages = () => fileArray;
