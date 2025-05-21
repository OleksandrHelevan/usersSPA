let users = [];
const NUMBER_OF_CARD_PER_PAGE = 30;
let usersButton = document.getElementById('users');
let cardContainer = document.getElementById('card-container');
let isLoading = false;
let lastFetchTime = 0;
let currentUsers = [];

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function applyFiltersFromUrl() {
    showLoading();
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    const age = params.get('age') || '';
    const birthYear = params.get('birthYear') || '';
    const location = params.get('location') || '';
    const email = params.get('email') || '';
    const sort = params.get('sort');


    document.getElementById('search').value = name;
    document.getElementById('filter-age').value = age;
    document.getElementById('filter-year').value = birthYear;
    document.getElementById('filter-location').value = location;
    document.getElementById('filter-email').value = email;

    applyAllFilters();

    if (sort) {
        switch (sort) {
            case 'name':
                document.getElementById('sort-by-name').click();
                break;
            case 'age':
                document.getElementById('sort-by-age').click();
                break;
            case 'registration':
                document.getElementById('sort-by-registration').click();
                break;
        }
    }
    hideLoading();
}

function applyAllFilters() {
    const name = document.getElementById('search').value.trim().toLowerCase();
    const age = parseInt(document.getElementById('filter-age').value.trim(), 10);
    const birthYear = parseInt(document.getElementById('filter-year').value.trim(), 10);
    const location = document.getElementById('filter-location').value.trim().toLowerCase();
    const email = document.getElementById('filter-email').value.trim().toLowerCase()

    let filtered = users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        const userAge = user.dob.age;
        const userBirthYear = new Date(user.dob.date).getFullYear();
        const userLocation = `${user.location.city}, ${user.location.country}`.toLowerCase();
        const userEmail = `${user.email}`.toLowerCase();
        return (
            (!name || fullName.includes(name)) &&
            (isNaN(age) || userAge === age) &&
            (isNaN(birthYear) || userBirthYear === birthYear) &&
            (!location || userLocation.includes(location)) &&
            (!email || userEmail.includes(email))
        );
    });

    renderFiltered(filtered);
    setUrl({
        name: name || '',
        age: isNaN(age) ? '' : age,
        birthYear: isNaN(birthYear) ? '' : birthYear,
        location: location || '',
        email: email || ''
    });
}

console.log(localStorage.getItem('user'));

async function getUsers(n) {
    const response = await fetch(`https://randomuser.me/api/?results=${n}`, {
        headers: {'Content-Type': 'application/json'},
    });
    const result = await response.json();

    users = [...users, ...result.results];
    currentUsers = [...users];
}

function showUser(user) {
    const likedUsers = JSON.parse(localStorage.getItem('likedUsers') || '[]');
    const isLiked = likedUsers.some(u => u.login.uuid === user.login.uuid);

    return `
        <div class="user-card">
            <div class="user-info">
                <p class="user-card-title">${user.name.first} ${user.name.last}</p>
                <p class="user-card-text">Age: ${user.dob.age}</p>
                <p class="user-card-text">Location: ${user.location.city}, ${user.location.country}</p>
                <p class="user-card-text">Gender: ${user.gender}</p>
                <p class="user-card-text">Phone: ${user.phone}</p>
                <p class="user-card-text">Email: ${user.email}</p>
                <p class="user-card-text">Reg-age: ${user.registered.age}</p>
            </div>
            <img class="user-img" src="${user.picture.large}" alt="User image">
            <button class="like ${isLiked ? 'liked' : ''}" data-user-id="${user.login.uuid}">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" 
                    width="24px" fill="#000000">
                    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                </svg>
            </button>
        </div>`;
}

usersButton.addEventListener('click', async () => {
    if (getItemWithExpire('user')) {
        cardContainer.style.display = 'flex';
        cabinetContainer.style.display = 'none';

        if (users.length === 0) {
            try {
                showLoading();
                await getUsers(NUMBER_OF_CARD_PER_PAGE * 3);
                currentUsers = [...users];
                showPage(1);
            } catch (error) {
                console.error('Помилка при ініціалізації користувачів:', error);
                getError('Не вдалося ініціалізувати користувачів. Спробуйте пізніше.');
            } finally {
                hideLoading();
            }
        } else {
            showPage(1);
        }
    }
});


async function generateOnePage(pageNumber = 1) {
    const totalNeeded = pageNumber * NUMBER_OF_CARD_PER_PAGE;

    if (users.length < totalNeeded) {
        const now = Date.now();
        if (now - lastFetchTime < 2000 || isLoading) return;

        isLoading = true;
        showLoading();
        lastFetchTime = now;

        const toFetch = totalNeeded - users.length;
        await getUsers(toFetch);

        isLoading = false;
        hideLoading();
    }

    showPage(pageNumber);
    setUrl({page: pageNumber});
}


function getError(message = 'Щось пішло не так. Спробуйте ще раз пізніше.') {
    const errorMessageDiv = document.getElementById('error-message');
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        setTimeout(() => {
            errorMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = '';
        }, 20000);
    }
}


document.addEventListener('scroll', debounce(() => {
    if (!getItemWithExpire('user')) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= fullHeight - 100) {
        const currentPage = getPageFromUrl();
        const nextPage = currentPage + 1;

        generateOnePage(nextPage).catch(error => {
            console.error('Помилка при завантаженні користувачів:', error);
            getError('Не вдалося завантажити користувачів. Спробуйте пізніше.');
        });
    }
}, 500));


function renderSortedUsers(sortedUsers) {
    cardContainer.innerHTML = '';
    sortedUsers.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
    currentUsers = sortedUsers;
}

document.getElementById('sort-by-name').addEventListener('click', () => {
    showLoading();
    const sorted = [...currentUsers].sort((a, b) => {
        const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    renderSortedUsers(sorted);
    setUrl({sort: 'name'});
    hideLoading();
});

document.getElementById('sort-by-age').addEventListener('click', () => {
    showLoading();
    const sorted = [...currentUsers].sort((a, b) => a.dob.age - b.dob.age);
    renderSortedUsers(sorted);
    setUrl({sort: 'age'});
    hideLoading();
});

document.getElementById('sort-by-registration').addEventListener('click', () => {
    showLoading();
    const sorted = [...currentUsers].sort((a, b) => new Date(b.registered.date) - new Date(a.registered.date));
    renderSortedUsers(sorted);
    setUrl({sort: 'registration'});
    hideLoading();
});

function renderFiltered(filtered) {
    currentUsers = filtered;
    cardContainer.innerHTML = '';
    filtered.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
}

document.getElementById('filter-age').addEventListener('input', debounce(applyAllFilters, 300));
document.getElementById('filter-year').addEventListener('input', debounce(applyAllFilters, 300));
document.getElementById('filter-location').addEventListener('input', debounce(applyAllFilters, 300));
document.getElementById('filter-email').addEventListener('input', debounce(applyAllFilters, 300));
document.getElementById('search').addEventListener('input', debounce(applyAllFilters, 300));
window.addEventListener('popstate', () => {
    applyFiltersFromUrl();
});
document.addEventListener('DOMContentLoaded', () => {
    applyFiltersFromUrl();

    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page'));
    if (!isNaN(pageParam)) {
        currentPage = pageParam;
    }

    if (users.length > 0) {
        showPage(currentPage);
    }
});