
const recordDetails = (url, all = false) => {
    const recordRows = document.getElementsByTagName('tr');
    for(let row of recordRows){
        row.addEventListener('click', ()=>{
            let rowId = row.id;
             window.location = all ? `${url}#${rowId}-all` : `${url}#${rowId}`
            
        })
    }
}

const adminRecordDetailsInit = (all = false) => {
    if(all){
    recordDetails('./admin-record-details.html', true);    
  } else {
    recordDetails('./admin-record-details.html');
    }
}


const userRecordDetailsInit = () => {
    recordDetails('./my-record-details.html');
}

const generalRecordDetailsInit = () => {
    recordDetails('./record-details.html');
}