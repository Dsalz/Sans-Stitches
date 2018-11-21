const addImageBtn = document.getElementById('add-image-btn');
const addImageInput = document.getElementById('add-image-input');
const imagePreviewDiv = document.getElementById('image-preview-div');
const addVideoBtn = document.getElementById('add-video-btn');
const addVideoInput = document.getElementById('add-video-input');
const videoPreviewDiv = document.getElementById('video-preview-div');

addImageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addImageInput.dispatchEvent(new MouseEvent('click'))
})

addVideoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addVideoInput.dispatchEvent(new MouseEvent('click'))
})

addImageInput.addEventListener('change', ()=>{
    let newForm = new FormData();

    newForm.append('image' , addImageInput.files[0]);
    newForm.set('enctype', 'multipart/formdata');

    //CODE FOR SENDING IMAGE TO BACKEND HERE
    

})

addVideoInput.addEventListener('change', ()=>{
    let newForm = new FormData();

    newForm.append('video' , addVideoInput.files[0]);
    newForm.set('enctype', 'multipart/formdata');

    //CODE FOR SENDING VIDEO TO BACKEND HERE
    

})