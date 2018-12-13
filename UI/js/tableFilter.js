const tableFilterInit = () => {
  const selectField = document.getElementById('dashboard-table-select');

selectField.addEventListener('change', () => {
    let optionSelected = selectField.options[selectField.selectedIndex].value;
    let allRows = document.querySelectorAll('tr.dashboard-table-row');

    if(optionSelected !== "All"){

        allRows.forEach( row => {
            row.style.display = 'none';
        })
        document.querySelectorAll(`tr.${optionSelected}`).forEach( row => {
            row.style.display = 'table-row';
        })

    }

    else{
        allRows.forEach( row => {
            row.style.display = 'table-row';
        })
    }

})
}
