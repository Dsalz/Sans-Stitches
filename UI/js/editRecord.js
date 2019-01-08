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
  window.location = `./my-record-details.html#${window.location.href.split('#')[1]}`;
};


const trackChanges = () => {
  const allInputFields = document.getElementsByTagName('input');
  for(let input of allInputFields){
    input.addEventListener('change', () => {
      changedFields.push(input.id);
    })
  }
}

const showImages = (imagesArr) => {
  imagesArr.forEach((image) => {
    const img = document.createElement('img');
    img.src = `${currApiEndpoint}/img/${image}`;
    document.getElementById('image-preview-div').insertAdjacentElement('beforeend', img);
  });
};

const showAddress = (lat, lng) => {
  let position = {lat, lng};
  let geocoder = new google.maps.Geocoder;
  geocoder.geocode({location: position}, function(results, status){
    document.getElementById('location').value = results[0].formatted_address;
  });
}

const editRecordForm = document.getElementById('edit-record-form');
const editRecordFormComment = document.getElementById('comment');
const editRecordFormDescription = document.getElementById('description');
const editRecordFormLatitude = document.getElementById('location-latitude');
const editRecordFormLongitude = document.getElementById('location-longitude');
const editRecordFormVideo = document.getElementById('video');

let typeEndpoint;
let recordId;
let changedFields = [];
const getRecordInfo = () => {
  const identifier = window.location.href.split('#')[1];
  if (identifier.split('-')[0] === 'r') {
    typeEndpoint = 'red-flags';
  } else if (identifier.split('-')[0] === 'i') {
    typeEndpoint = 'interventions';
  } else{
    return showModal('Error', 'Record does not exist');
  }

  const radioVal = typeEndpoint === 'red-flags' ? 'Red Flag' : 'Intervention';
  document.querySelector(`input[name="type"][value="${radioVal}"]`).dispatchEvent(new MouseEvent('click'));


  recordId = identifier.split('-')[1];

  fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}`)
    .then(res => res.json())
    .then((res) => {
      const { error, data, status } = res;
      if (error) {
        return showModal('Error', error);
      }
      const {
        comment, description, location, images, videos,
      } = data[0];
      const latitude = location.split(' , ')[0];
      const longitude = location.split(' , ')[1];
      editRecordFormComment.value = comment;
      editRecordFormDescription.value = description;
      editRecordFormLatitude.textContent = latitude;
      editRecordFormLongitude.textContent = longitude;
      editRecordFormVideo.value = videos.length ? videos[0] : '';
      if (latitude && longitude) {
        showAddress(Number(latitude), Number(longitude));
      }
      showImages(images);
      trackChanges();
    });
};

getRecordInfo();

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

const patchRecord = (fieldUpdated, data) => {
  if (fieldUpdated === 'addImage') {
    const imgFormData = new FormData();
    data.images.forEach((file, index) => imgFormData.append(`files[${index}]`, file));
    imgFormData.append('enctype', 'multipart/form-data');
    const fetchConfigImg = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${sansStitchesUserToken}`
      },
      body: imgFormData,
    };
    return fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}/addImages`, fetchConfigImg);
  }
  const fetchConfig = {
    method: 'PATCH',
    headers: setUpHeader(),
    body: JSON.stringify(data),
  };
  return fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}/${fieldUpdated}`, fetchConfig);
};

editRecordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormErrors();
  const editRecordFormImages = getImages();
  const formData = {};
  if (editRecordFormComment.value.trim()) {
    formData.comment = editRecordFormComment.value;
  }
  if (editRecordFormDescription.value.trim()) {
    formData.description = editRecordFormDescription.value;
  }
  if (editRecordFormLatitude.textContent.trim()) {
    formData.latitude = editRecordFormLatitude.textContent;
  }
  if (editRecordFormLongitude.textContent.trim()) {
    formData.longitude = editRecordFormLongitude.textContent;
  }
  if (editRecordFormVideo.value.trim()) {
    formData.video = editRecordFormVideo.value;
  }
  const updateChangedFields = () => {
    if (changedFields.indexOf('comment') > -1) {
      changedFields = changedFields.filter(field => field !== 'comment');
      patchRecord('comment', { comment: formData.comment })
        .then((resp) => {
          if(resp.error){
            return showModal('Error', error);
          }
          updateChangedFields()
        });
    } else if (changedFields.indexOf('location') > -1) {
      changedFields = changedFields.filter(field => field !== 'location');
      patchRecord('location', { latitude: formData.latitude, longitude: formData.longitude })
        .then((resp) => {
          if(resp.error){
            return showModal('Error', error);
          }
          updateChangedFields()
        });
    } else if (changedFields.indexOf('add-image-input') > -1) {
      changedFields = changedFields.filter(field => field !== 'add-image-input');
      patchRecord('addImages', { images: editRecordFormImages })
        .then((resp) => {
          if(resp.error){
            return showModal('Error', error);
          }
          updateChangedFields()
        });
    } else if (changedFields.indexOf('video') > -1) {
      changedFields = changedFields.filter(field => field !== 'video');
      patchRecord('addVideo', { video: formData.video })
        .then((resp) => {
          if(resp.error){
            return showModal('Error', error);
          }
          updateChangedFields()
        });
    } else {
      showModal('Success', 'Record updated!', nextStep);
    }
  };
  updateChangedFields();
});

const deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', () => {
  const fetchConfig = {
    method: 'DELETE',
    headers: setUpHeader(),
  };
  fetch(`${currApiEndpoint}/${typeEndpoint}/${recordId}`, fetchConfig)
    .then(resp => resp.json())
    .then((resp) => {
      const { error, data} = resp;
      if (error) {
        return showModal('Error', error);
      }
      const nextDeleteStep = () => {
        window.location = './myrecords.html';
      };
      showModal('Success', data[0].message, nextDeleteStep);
    });
});
