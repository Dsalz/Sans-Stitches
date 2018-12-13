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
// if (!user.is_admin) {
//   invalidToken();
// }

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

const capitalize = string => console.log(string) || string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getYear() + 1900}`;
};

fetch(`${currApiEndpoint}/red-flags`, getMyRecordsConfig)
  .then(resp => resp.json())
  .then((resp) => {
    if (resp.error) {
      return resp.status === 401 ? invalidToken() : alert(resp.error);
    }
    myRedFlagRecords = resp.data;
    fetch(`${currApiEndpoint}/interventions`, getMyRecordsConfig)
      .then(response => response.json())
      .then((response) => {
        if (response.error) {
          return response.status === 401 ? invalidToken() : alert(error);
        }
        myInterventionRecords = response.data;

        allRecords = [...myRedFlagRecords, ...myInterventionRecords];
        let tableData = '';
        allRecords.forEach((record) => {
          console.log(record);
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
                          </td>
                          </a>
                      </tr>`;
        });
        tableBody.innerHTML = tableData;
        adminRecordDetailsInit('all');
        tableFilterInit();
      });
  });
