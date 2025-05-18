let logoutBtn = document.getElementById('logout');

function logout() {
    console.log('logged out');
    localStorage.removeItem('user');
    setUrl({ page: 'logout' });
    let cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    document.getElementById("filters").style.display = 'none';
    cabinetContainer.style.display = 'none';
    formContainer.style.display = 'flex';
}

logoutBtn.addEventListener('click', logout);
