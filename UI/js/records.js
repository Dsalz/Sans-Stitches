
const recordDetails = url => {
    const recordRows = document.getElementsByTagName('tr');
    for(let row of recordRows){
        row.addEventListener('click', ()=>{
            let rowId = row.id;
    
            window.location = `${url}`
        })
    }
}

const adminRecordDetails = () => {
    recordDetails('./admin-record-details.html');
}


const userRecordDetails = () => {
    recordDetails('./record-details.html');
}