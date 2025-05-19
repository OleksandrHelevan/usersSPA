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
            showPage(i);
        });
        pagination.appendChild(button);
    }
}

function showPage(pageNumber) {
    const start = (pageNumber - 1) * NUMBER_OF_CARD_PER_PAGE;
    const end = start + NUMBER_OF_CARD_PER_PAGE;
    const usersToShow = currentUsers.slice(start, end);
    renderFiltered(usersToShow);
    renderPagination(Math.ceil(currentUsers.length / NUMBER_OF_CARD_PER_PAGE), pageNumber);
}

renderPagination(Math.ceil(currentUsers.length / NUMBER_OF_CARD_PER_PAGE), 1);
showPage(1);
renderPagination(Math.ceil(currentUsers.length / NUMBER_OF_CARD_PER_PAGE), 1);
showPage(1);
