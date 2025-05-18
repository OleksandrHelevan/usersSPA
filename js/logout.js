let logoutBtn = document.getElementById('logout');

function logout() {
    console.log('logged out');
    localStorage.removeItem('user');
    setUrl({ page: 'logout' });
    let cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    cabinetContainer.style.display = 'none';
    formContainer.style.display = 'block';
}

logoutBtn.addEventListener('click', logout);
