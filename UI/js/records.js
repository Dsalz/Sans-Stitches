

const adminRecordDetails = () => {
    const recordRows = document.getElementsByTagName('tr');
    for(let row of recordRows){
        row.addEventListener('click', ()=>{
            let rowId = row.id;
    
            window.location = `./admin-record-details.html`
        })
    }
}


const userRecordDetails = () => {
    const recordRows = document.getElementsByTagName('tr');
    for(let row of recordRows){
        row.addEventListener('click', ()=>{
            let rowId = row.id;
    
            window.location = `./record-details.html`
        })
    }
}