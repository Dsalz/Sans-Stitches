const invalidToken = () => {
  window.location = './login.html';
};

const { sansStitchesUser, sansStitchesUserToken } = localStorage;
if (!sansStitchesUserToken) {
  invalidToken();
}

const currApiEndpoint = 'https://sans-stitches.herokuapp.com/api/v1';
// const currApiEndpoint = 'http://localhost:4000/api/v1';

const user = JSON.parse(sansStitchesUser);

const dashboardUserName = document.getElementById('user');
dashboardUserName.textContent = user.firstname;


const commentDisplay = document.getElementById('comment');
const descriptionDisplay = document.getElementById('description');
const typeDisplay = document.getElementById('type');
const videoDisplay = document.getElementById('video');
const feedbackDisplay = document.getElementById('feedback');
const statusDisplay = document.getElementById('status');


let typeEndpoint;
let recordId;

const showImages = (imagesArr) => {
  const imgPrevDiv = document.getElementById('image-preview-div');
  if (imagesArr.length) {
    imagesArr.forEach((image) => {
      const img = document.createElement('img');
      img.src = `${currApiEndpoint}/img/${image}`;
      imgPrevDiv.insertAdjacentElement('beforeend', img);
    });
  } else {
    imgPrevDiv.textContent = 'No images Provided';
  }
};

const capitalize = string => string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

const getRecordInfo = () => {
  const identifier = window.location.href.split('#')[1];
  if (identifier.split('-')[0] === 'r') {
    typeEndpoint = 'red-flags';
  } else if (identifier.split('-')[0] === 'i') {
    typeEndpoint = 'interventions';
  } else {
    return showModal('Error', 'Record does not exist');
  }
  const typeVal = typeEndpoint === 'red-flags' ? 'Red Flag' : 'Intervention';
  recordId = identifier.split('-')[1];

  fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}`)
    .then(res => res.json())
    .then((res) => {
      const { error, data } = res;
      if (error) {
        return showModal('Error', error);
      }
      const {
        comment, description, location, images, videos, status, feedback,
      } = data[0];
      const videoLink = videos.length ? videos[0] : '';
      const latitude = Number(location.split(' , ')[0]);
      const longitude = Number(location.split(' , ')[1]);
      commentDisplay.textContent = comment;
      descriptionDisplay.textContent = !description ? 'No Description Provided' : description;
      typeDisplay.textContent = typeVal;
      statusDisplay.textContent = capitalize(status);
      if (videoLink) {
        videoDisplay.textContent = videoLink;
        videoDisplay.setAttribute('href', videoLink);
      } else {
        videoDisplay.textContent = 'No Video Provided';
      }
      feedbackDisplay.textContent = feedback;
      showImages(images);
      if(latitude && longitude) {
        addMapToScreen(latitude, longitude);
      }
      else {
        noMap();
      }
    });
};

getRecordInfo();
