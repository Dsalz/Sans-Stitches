const currApiEndpoint = 'https://sans-stitches.herokuapp.com/api/v1';

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

showLoadingSvg();

fetch(`${currApiEndpoint}/red-flags`)
  .then(resp => resp.json())
  .then((resp) => {
    if (resp.error) {
      hideLoadingSvg();
      return showModal('Error', resp.error);
    }
    myRedFlagRecords = resp.data.filter(record => record.status === 'resolved');
    fetch(`${currApiEndpoint}/interventions`)
      .then(response => response.json())
      .then((response) => {
        if (response.error) {
          return showModal('Error', response.error);
        }
        myInterventionRecords = response.data.filter(record => record.status === 'resolved');

        allRecords = [...myRedFlagRecords, ...myInterventionRecords];
        let tableData = '';
        allRecords = allRecords.sort((a,b) => b.id - a.id);
        allRecords.forEach((record) => {
          const {
            id, status, type, comment, created_on,
          } = record;
          const rowClass = getClass(status);
          tableData += `<tr class="dashboard-table-row ${rowClass}" id="${type[0]}-${id}">                         
                          <td> ${comment} </td>
                          <td> ${capitalize(type)} </td>
                          <td> ${formatDate(created_on)} </td>
                      </tr>`;
        });
        hideLoadingSvg();
        tableBody.innerHTML = tableData;
        generalRecordDetailsInit();
      });
  });
