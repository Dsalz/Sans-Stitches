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

const dashboardUserName = document.getElementById('user');
dashboardUserName.textContent = user.firstname;

const clearFormErrors = () => {
  const allErrorMessages = document.querySelectorAll('.form-error');
  for (let message of allErrorMessages) {
    message.remove();
  }
};

const nextStep = () => {
  window.location = './myrecords.html';
};

const displayFormError = (field, error) => {
  const errorParagraph = document.createElement('p');
  errorParagraph.classList.add('form-error', 'red-cl', 'absolute-error');
  errorParagraph.textContent = error;
  document.getElementById(field).insertAdjacentElement('afterend', errorParagraph);
};

const handleFormErrors = (errors) => {
  const commentError = errors.find(e => e.comment);
  const locationError = errors.find(e => e.geolocation);
  const descriptionError = errors.find(e => e.description);
  if (commentError) {
    displayFormError('comment', commentError.comment.replace('Comment', 'Title'));
  }
  if (locationError) {
    displayFormError('location', locationError.geolocation);
  }
  if (descriptionError) {
    displayFormError('description', descriptionError.phoneNumber);
  }
  window.scrollTo(0, 0);
};

const newRecordForm = document.getElementById('new-record-form');
const newRecordFormComment = document.getElementById('comment');
const newRecordFormDescription = document.getElementById('description');
const newRecordFormLatitude = document.getElementById('location-latitude');
const newRecordFormLongitude = document.getElementById('location-longitude');
const newRecordFormVideo = document.getElementById('video');

newRecordForm.addEventListener('submit', (e) => {
  const newRecordFormType = document.querySelector('input[name="type"]:checked');
  e.preventDefault();
  clearFormErrors();
  const newRecordFormImages = getImages();
  const formData = {};
  if (newRecordFormComment.value) {
    formData.comment = newRecordFormComment.value;
  }
  if (newRecordFormDescription.value) {
    formData.description = newRecordFormDescription.value;
  }
  if (newRecordFormLatitude.textContent) {
    formData.latitude = newRecordFormLatitude.textContent;
  }
  if (newRecordFormLongitude.textContent) {
    formData.longitude = newRecordFormLongitude.textContent;
  }
  if (newRecordFormVideo.value) {
    formData.video = newRecordFormVideo.value;
  }

  const fetchConfig = {
    method: 'POST',
    headers: setUpHeader(),
    body: JSON.stringify(formData),
  };
  const typeEndpoint = newRecordFormType.value === 'Red Flag' ? 'red-flags' : 'interventions';
  fetch(`${currApiEndpoint}/${typeEndpoint}`, fetchConfig)
    .then(resp => resp.json())
    .then((response) => {
      const { error, data } = response;
      if (error) {
        return typeof error === 'string' ? showModal('Error', error) : handleFormErrors(error);
      }
      const { message, id } = data[0];
      if (!newRecordFormImages.length) {
        showModal('Success', message);
      } else {
        const imgFormData = new FormData();
        newRecordFormImages.forEach((file, index) => imgFormData.append(`files[${index}]`, file));
        imgFormData.append('enctype', 'multipart/form-data');
        const fetchConfigImg = {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${sansStitchesUserToken}`
          },
          body: imgFormData,
        };
        fetch(`${currApiEndpoint}/${typeEndpoint}/${id}/addImages`, fetchConfigImg)
          .then(() => {
            showModal('Success', message, nextStep);
          });
      }

    })
    .catch(err => showModal('Error', err));
})