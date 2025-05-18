let users = []
const NUMBER_OF_CARD_PER_PAGE = 30;
let usersButton = document.getElementById('users');
let cardContainer = document.getElementById('card-container');
let isLoading = false;
let lastFetchTime = 0;
let counter = 0;
const searchInput = document.getElementById('search');
let currentUsers = []

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function filterUsersByName(name) {
    const filtered = users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return fullName.includes(name.toLowerCase());
    });

    cardContainer.innerHTML = '';
    filtered.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
}

searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    filterUsersByName(query);
}, 300));


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
            .then(() => {
            })
            .catch((error) => {
                console.error('Помилка при генерації:', error);
            });
    }
});

async function generateOnePage() {
    const now = Date.now();
    if (now - lastFetchTime < 2000 || isLoading) return;

    isLoading = true;
    lastFetchTime = now;

    await getUsers(NUMBER_OF_CARD_PER_PAGE);
    if (!cardContainer) return;

    users.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });

    counter++;
    setUrl({page: `users-${counter}`});

    isLoading = false;
}

document.addEventListener('scroll', () => {
    if (getItemWithExpire('user')) {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.offsetHeight;

        if (scrollTop + windowHeight >= fullHeight - 100) {
            generateOnePage().catch(error => {
                console.error('Помилка при завантаженні користувачів:', error);
            });
        }
    }
});

function renderSortedUsers(sortedUsers) {
    cardContainer.innerHTML = '';
    sortedUsers.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
}

document.getElementById('sort-by-name').addEventListener('click', () => {
    const sorted = [...users].sort((a, b) => {
        const nameA = `${a.name.first} ${a.name.last}`.toLowerCase();
        const nameB = `${b.name.first} ${b.name.last}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    renderSortedUsers(sorted);
});

document.getElementById('sort-by-age').addEventListener('click', () => {
    const sorted = [...users].sort((a, b) => a.dob.age - b.dob.age);
    renderSortedUsers(sorted);
});

document.getElementById('sort-by-registration').addEventListener('click', () => {
    const sorted = [...users].sort((a, b) => new Date(b.registered.date) - new Date(a.registered.date));
    renderSortedUsers(sorted);
});

function filterByAge(age) {
    const parsedAge = parseInt(age, 10);
    if (age === '' || isNaN(parsedAge)) {
        renderFiltered(users);
        return;
    }

    const filtered = users.filter(user => user.dob.age === parsedAge);
    renderFiltered(filtered);
}

function filterByBirthYear(year) {
    const parsedYear = parseInt(year, 10);
    if (year === '' || isNaN(parsedYear)) {
        renderFiltered(users);
        return;
    }

    const filtered = users.filter(user => {
        const birthYear = new Date(user.dob.date).getFullYear();
        return birthYear === parsedYear;
    });
    renderFiltered(filtered);
}



function filterByLocation(query) {
    const filtered = users.filter(user => {
        const location = `${user.location.city}, ${user.location.country}`.toLowerCase();
        return location.includes(query.toLowerCase());
    });
    renderFiltered(filtered);
}

function renderFiltered(filtered) {
    currentUsers = filtered;
    cardContainer.innerHTML = '';
    filtered.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
}




document.getElementById('filter-age').addEventListener('input', debounce((e) => {
    const age = e.target.value.trim();
    filterByAge(age);
}, 300));

document.getElementById('filter-year').addEventListener('input', debounce((e) => {
    const year = e.target.value.trim();
    filterByBirthYear(year);
}, 300));

document.getElementById('filter-location').addEventListener('input', debounce((e) => {
    filterByLocation(e.target.value.trim());
}, 300));
