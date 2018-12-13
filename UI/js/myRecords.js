const invalidToken = () => {
  window.location = './login.html';
};

const { sansStitchesUser, sansStitchesUserToken } = localStorage;
if (!sansStitchesUserToken) {
  invalidToken();
}

const currApiEndpoint = 'https://sans-stitches.herokuapp.com/api/v1';
// const currApiEndpoint = 'http://localhost:4000/api/v1';

const setUpHeader = () => ({ 'Authorization': `Bearer ${sansStitchesUserToken}` });

const user = JSON.parse(sansStitchesUser);

const dashboardUserName = document.getElementById('user');
dashboardUserName.textContent = user.firstname;

const getMyRecordsConfig = {
  headers: setUpHeader(),
};

let allRecords;
let myRedFlagRecords;
let myInterventionRecords;

const tableBody = document.getElementById('table-body');

const getClass = (status) => {
  let rowClass;
  switch (status) {
    case 'pending review':
      rowClass = 'Pending';
      break;
    case 'under investigation':
      rowClass = 'Under-Investigation';
      break;
    case 'resolved':
      rowClass = 'Resolved';
      break;
    default:
      rowClass = 'Rejected';
      break;
  }
  return rowClass;
};

const capitalize = string => string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getYear() + 1900}`;
};

fetch(`${currApiEndpoint}/red-flags/mine`, getMyRecordsConfig)
  .then(resp => resp.json())
  .then((resp) => {
    if (resp.error) {
      return resp.status === 401 ? invalidToken() : showModal('Error', resp.error);
    }
    myRedFlagRecords = resp.data;
    fetch(`${currApiEndpoint}/interventions/mine`, getMyRecordsConfig)
      .then(response => response.json())
      .then((response) => {
        if (response.error) {
          return response.status === 401 ? invalidToken() : showModal('Error', error);
        }
        myInterventionRecords = response.data;
        allRecords = [...myRedFlagRecords, ...myInterventionRecords];
        let tableData = '';
        allRecords.forEach((record) => {
          const {
            id, status, type, comment, created_on,
          } = record;
          const rowClass = getClass(status);
          tableData += `<tr class="dashboard-table-row ${rowClass}" id="${type[0]}-${id}">                         
                          <td> ${comment} </td>
                          <td> ${capitalize(type)} </td>
                          <td> ${formatDate(created_on)} </td>
                          <td> ${capitalize(status)} </td>
                          <td>
                              <a class="dashboard-table-link edit-link" href="./edit-record.html#${type[0]}-${id}">
                                  <svg id="edit-svg" width="16px" height="19px" viewBox="0 0 16 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                          <g id="My-Records-Page" transform="translate(-910.000000, -267.000000)">
                                              <g id="Group-2" transform="translate(910.000000, 268.000000)">
                                                  <path d="M10.5,5.5 L4.5,13.5" id="Line-3" stroke="#D81E5B" stroke-width="3" stroke-linecap="square"></path>
                                                  <path d="M13.5,1.5 L13.38,1.66" id="Line-3-Copy" stroke="#D81E5B" stroke-width="3" stroke-linecap="square"></path>
                                                  <polygon id="Path-2" fill="#D81E5B" transform="translate(2.093396, 16.576831) rotate(-3.000000) translate(-2.093396, -16.576831) " points="1.4658568 15.1987855 3.47406171 16.8554235 0.71272957 17.9548763"></polygon>
                                              </g>
                                          </g>
                                      </g>
                                  </svg>
                              </a>

                          </td>
                          </a>
                      </tr>`;
        });
        tableBody.innerHTML = tableData;
        tableFilterInit();
        userRecordDetailsInit();
      });
  });
