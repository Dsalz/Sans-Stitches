const invalidToken = () => {
  window.location = './login.html';
};

const { sansStitchesUser, sansStitchesUserToken } = localStorage;
if (!sansStitchesUserToken) {
  invalidToken();
}

const currApiEndpoint = 'https://sans-stitches.herokuapp.com/api/v1';
// const currApiEndpoint = 'http://localhost:4000/api/v1';

const setUpHeader = () => ({
  'Authorization': `Bearer ${sansStitchesUserToken}`,
  'Content-Type': 'application/json',
});

const user = JSON.parse(sansStitchesUser);
if (!user.is_admin) {
  invalidToken();
}

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
  if (identifier.split('-')[2] === 'all') {
    const pendingRecordsLink = document.getElementById('pending-link');
    const allRecordsLink = document.getElementById('all-link');
    pendingRecordsLink.classList.remove('active');
    allRecordsLink.classList.add('active');
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
      document.querySelector(`input[name="status"][value="${status}"]`).dispatchEvent(new MouseEvent('click'));
      if (videoLink) {
        videoDisplay.textContent = videoLink;
        videoDisplay.setAttribute('href', videoLink);
      } else {
        videoDisplay.textContent = 'No Video Provided';
      }
      feedbackDisplay.textContent = feedback === 'No Feedback' ? null : feedback;
      showImages(images);
      if (latitude && longitude) {
        addMapToScreen(latitude, longitude);
      } else {
        noMap();
      }
    });
};

getRecordInfo();

const editStatusForm = document.getElementById('edit-status-form');
const editStatusFormFeedback = document.getElementById('feedback');

editStatusForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {};
  const editStatusFormStatus = document.querySelector('input[name="status"]:checked');
  formData.status = editStatusFormStatus.value;
  if (editStatusFormFeedback.value) {
    formData.feedback = editStatusFormFeedback.value;
  }
  const fetchConfig = {
    method: 'PATCH',
    headers: setUpHeader(),
    body: JSON.stringify(formData),
  };
  fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}/status`, fetchConfig)
    .then(resp => resp.json())
    .then((response) => {
      const { error, data } = response;
      if (error) {
        const errorMessage = error || error[0].status || error[0].feedback;
        return showModal('Error', errorMessage);
      }
      showModal('Success', data[0].message);
    });
});
