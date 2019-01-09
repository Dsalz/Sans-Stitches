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

const dashboardEmail = document.getElementById('email');
dashboardEmail.textContent = user.email;

const dashboardPhoneNo = document.getElementById('phoneNumber');
dashboardPhoneNo.textContent = user.phone_number;

const dashboardFullName = document.getElementById('fullName');
const { firstname, lastname, othername } = user;
dashboardFullName.textContent = `${firstname} ${othername} ${lastname}`;

const getMyRecordsConfig = {
  headers: setUpHeader(),
};

const totalRecordsNo = document.getElementById('total-no');

const totalRedFlagRecordsNo = document.getElementById('red-flag-no');
const totalPendingRedFlagRecordsNo = document.getElementById('red-flag-pending-no');
const totalUIRedFlagRecordsNo = document.getElementById('red-flag-under-investigation-no');
const totalResolvedRedFlagRecordsNo = document.getElementById('red-flag-resolved-no');
const totalRejectedRedFlagRecordsNo = document.getElementById('red-flag-rejected-no');

const totalInterventionRecordsNo = document.getElementById('intervention-no');
const totalPendingInterventionRecordsNo = document.getElementById('intervention-pending-no');
const totalUIInterventionRecordsNo = document.getElementById('intervention-under-investigation-no');
const totalResolvedInterventionRecordsNo = document.getElementById('intervention-resolved-no');
const totalRejectedInterventionRecordsNo = document.getElementById('intervention-rejected-no');

let myRedFlagRecords;
let myInterventionRecords;

showLoadingSvg();

fetch(`${currApiEndpoint}/red-flags/mine`, getMyRecordsConfig)
  .then(resp => resp.json())
  .then((resp) => {
    const { status, error, data } = resp;
    if (error) {
      hideLoadingSvg();
      return status === 401 ? invalidToken() : showModal('Error', error);
    }
    myRedFlagRecords = data;
    fetch(`${currApiEndpoint}/interventions/mine`, getMyRecordsConfig)
      .then(resp => resp.json())
      .then((resp) => {
        hideLoadingSvg();
        if (resp.error) {
          return resp.status === 401 ? invalidToken() : showModal('Error', error);
        }
        myInterventionRecords = resp.data;

        totalRecordsNo.textContent = myRedFlagRecords.length + myInterventionRecords.length;

        totalRedFlagRecordsNo.textContent = myRedFlagRecords.length;
        totalPendingRedFlagRecordsNo.textContent = myRedFlagRecords.filter(record => record.status === 'pending review').length;
        totalUIRedFlagRecordsNo.textContent = myRedFlagRecords.filter(record => record.status === 'under investigation').length;
        totalResolvedRedFlagRecordsNo.textContent = myRedFlagRecords.filter(record => record.status === 'resolved').length;
        totalRejectedRedFlagRecordsNo.textContent = myRedFlagRecords.filter(record => record.status === 'rejected').length;

        totalInterventionRecordsNo.textContent = myInterventionRecords.length;
        totalPendingInterventionRecordsNo.textContent = myInterventionRecords.filter(record => record.status === 'pending review').length;
        totalUIInterventionRecordsNo.textContent = myInterventionRecords.filter(record => record.status === 'under investigation').length;
        totalResolvedInterventionRecordsNo.textContent = myInterventionRecords.filter(record => record.status === 'resolved').length;
        totalRejectedInterventionRecordsNo.textContent = myInterventionRecords.filter(record => record.status === 'rejected').length;
      });
  });
