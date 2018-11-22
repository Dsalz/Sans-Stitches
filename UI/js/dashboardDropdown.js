const dropdownToggle = document.querySelector('#user');
const dropdownMenu = document.querySelector('#dropdown-menu');

const sidebarToggle = document.querySelector('#toggle-sidebar');
const sidebar = document.querySelector('#sidebar');

dropdownToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show-dropdown');
    dropdownToggle.classList.toggle('triangle-up');
    dropdownToggle.classList.toggle('triangle-down');
})

sidebarToggle.addEventListener('click' , () => {
    sidebar.classList.toggle('responsive-sidebar');
})