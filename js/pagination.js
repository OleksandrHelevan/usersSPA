let currentPage = 1;

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-btn';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            generateOnePage(i);
        });
        pagination.appendChild(button);
    }
}

function getPageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10);
    return isNaN(page) || page < 1 ? 1 : page;
}

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('user')) {
        const page = getPageFromUrl();
        generateOnePage(page);
    }
});

function showPage(pageNumber) {
    const start = (pageNumber - 1) * NUMBER_OF_CARD_PER_PAGE;
    const end = start + NUMBER_OF_CARD_PER_PAGE;

    const usersToShow = users.slice(start, end);
    currentUsers = usersToShow;

    cardContainer.innerHTML = '';
    usersToShow.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });

    const totalPages = Math.ceil(users.length / NUMBER_OF_CARD_PER_PAGE);
    renderPagination(totalPages, pageNumber);

    window.scrollTo({ top: 0, behavior: 'auto' });
}


renderPagination(Math.ceil(currentUsers.length / NUMBER_OF_CARD_PER_PAGE), 1);
showPage(1);