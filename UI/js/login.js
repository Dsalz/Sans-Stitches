const loginForm = document.getElementById('login-index-form');
const loginFormEmail = loginForm.children.email;
const loginFormPassword = loginForm.children.password;
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
  const emailError = errors.find(e => e.email);
  const passwordError = errors.find(e => e.password);
  if (emailError) {
    displayFormError('email', emailError.email);
  }
  if (passwordError) {
    displayFormError('password', passwordError.password);
  }
};

loginForm.addEventListener('submit', (e) => {
  clearFormErrors();
  e.preventDefault();
  const data = {};
  if (loginFormEmail.value) {
    data.email = loginFormEmail.value;
  }
  if (loginFormPassword.value) {
    data.password = loginFormPassword.value;
  }
  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(`${currApiEndpoint}/auth/login`, fetchConfig).then(resp => resp.json())
    .then((resp) => {
      const { error, data } = resp;
      if (error) {
        return typeof error === 'string' ? showModal('Error', error) : handleFormErrors(error);
      }
      const { user, token } = data[0];
      localStorage.sansStitchesUser = JSON.stringify(user);
      localStorage.sansStitchesUserToken = token;
      window.location = (user.is_admin) ? './admin-overview.html' : './profile.html';
    })
    .catch(err => console.log(err));
});
