const signUpForm = document.getElementById('signup-index-form');
const signUpFormName = signUpForm.children.name;
const signUpFormEmail = signUpForm.children.email;
const signUpFormPhoneNumber = signUpForm.children.phonenumber;
const signUpFormPassword = signUpForm.children.password;
const signUpFormConfirmPassword = signUpForm.children.confirmpassword;

const currApiEndpoint = 'https://sans-stitches.herokuapp.com/api/v1';
// const currApiEndpoint = 'http://localhost:4000/api/v1';

const clearFormErrors = () => {
  const allErrorMessages = document.querySelectorAll('.form-error');
  for (let message of allErrorMessages) {
    message.remove();
  }
};
const displayFormError = (field, error) => {
  const errorParagraph = document.createElement('p');
  errorParagraph.classList.add('form-error', 'red-cl');
  errorParagraph.textContent = error;
  document.getElementById(field).insertAdjacentElement('afterend', errorParagraph);
};

const handleFormErrors = (errors) => {
  const nameError = errors.find(e => e.name);
  const emailError = errors.find(e => e.email);
  const phoneNumberError = errors.find(e => e.phoneNumber);
  const passwordError = errors.find(e => e.password);
  if (nameError) {
    displayFormError('name', nameError.name);
  }
  if (emailError) {
    displayFormError('email', emailError.email);
  }
  if (phoneNumberError) {
    displayFormError('phonenumber', phoneNumberError.phoneNumber);
  }
  if (passwordError) {
    displayFormError('password', passwordError.password);
  }
};

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormErrors();
  showLoadingSvg();
  const formData = {};
  if (signUpFormName.value) {
    formData.name = signUpFormName.value;
  }
  if (signUpFormEmail.value) {
    formData.email = signUpFormEmail.value;
  }
  if (signUpFormPhoneNumber.value) {
    formData.phoneNumber = signUpFormPhoneNumber.value;
  }
  if (signUpFormPassword.value) {
    formData.password = signUpFormPassword.value;
  }
  if (signUpFormConfirmPassword.value) {
    formData.confirmPassword = signUpFormConfirmPassword.value;
  }
  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  };
  fetch(`${currApiEndpoint}/auth/signup`, fetchConfig)
    .then(resp => resp.json())
    .then((resp) => {
      const { error, data } = resp;
      if (error) {
        hideLoadingSvg();
        return typeof error === 'string' ? showModal('Error', error) : handleFormErrors(error);
      }
      const { user, token } = data[0];
      localStorage.sansStitchesUser = JSON.stringify(user);
      localStorage.sansStitchesUserToken = token;
      window.location = './profile.html';
    })
    .catch(err => hideLoadingSvg() || showModal('Error', err));
});
