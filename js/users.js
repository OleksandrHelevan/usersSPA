let users = [];
const NUMBER_OF_CARD_PER_PAGE = 30;
let usersButton = document.getElementById('users');
let cardContainer = document.getElementById('card-container');
let isLoading = false;
let lastFetchTime = 0;
let counter = 0;
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
    const sort = params.get('sort');

    document.getElementById('search').value = name;
    document.getElementById('filter-age').value = age;
    document.getElementById('filter-year').value = birthYear;
    document.getElementById('filter-location').value = location;

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

    let filtered = users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        const userAge = user.dob.age;
        const userBirthYear = new Date(user.dob.date).getFullYear();
        const userLocation = `${user.location.city}, ${user.location.country}`.toLowerCase();

        return (
            (!name || fullName.includes(name)) &&
            (isNaN(age) || userAge === age) &&
            (isNaN(birthYear) || userBirthYear === birthYear) &&
            (!location || userLocation.includes(location))
        );
    });

    renderFiltered(filtered);
    setUrl({
        name: name || '',
        age: isNaN(age) ? '' : age,
        birthYear: isNaN(birthYear) ? '' : birthYear,
        location: location || ''
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
    return `
        <div class="user-card">
            <div class="user-info">
                <p class="user-card-title">${user.name.first} ${user.name.last}</p>
                <p class="user-card-text">Age: ${user.dob.age}</p>
                <p class="user-card-text">Location: ${user.location.city}, ${user.location.country}</p>
                <p class="user-card-text">Gender: ${user.gender}</p>
                <p class="user-card-text">Phone: ${user.phone}</p>
                <p class="user-card-text">Reg-age: ${user.registered.age}</p>
            </div>
            <img class="user-img" src="${user.picture.large}" alt="User image">
        </div>`;
}

usersButton.addEventListener('click', () => {
    if (getItemWithExpire('user')) {
        cardContainer.style.display = 'flex';
        cabinetContainer.style.display = 'none';
        generateOnePage()
            .then(applyFiltersFromUrl)
            .catch(error => {
                console.error('Помилка при ініціалізації користувачів:', error);
                getError('Не вдалося ініціалізувати користувачів. Спробуйте пізніше.');
            });
    }
});


async function generateOnePage() {
    const now = Date.now();
    if (now - lastFetchTime < 2000 || isLoading) return;

    isLoading = true;
    showLoading();
    lastFetchTime = now;

    const prevLength = users.length;
    await getUsers(NUMBER_OF_CARD_PER_PAGE);
    const newUsers = users.slice(prevLength);

    if (!cardContainer) return;

    newUsers.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });

    counter++;
    setUrl({ page: `users-${counter}` });
    renderPagination(counter, counter);

    isLoading = false;
    hideLoading();
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
    if (getItemWithExpire('user')) {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.offsetHeight;
        console.log(users.length);

        if (scrollTop + windowHeight >= fullHeight - 100) {
            generateOnePage().catch(error => {
                console.error('Помилка при завантаженні користувачів:', error);
                getError('Не вдалося завантажити користувачів. Спробуйте пізніше.');
            });
        }
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
document.getElementById('search').addEventListener('input', debounce(applyAllFilters, 300));
window.addEventListener('popstate', () => {
    applyFiltersFromUrl();
});
document.addEventListener('DOMContentLoaded', () => {
    applyFiltersFromUrl();
});
