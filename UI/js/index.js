const form = document.getElementById('index-form');


form.addEventListener('submit' , (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let isAdmin = email === "admin@yahoo.com";

    window.location = (isAdmin) ? './admin-overview.html' : './profile.html';
    
})