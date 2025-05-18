let users = []
const NUMBER_OF_CARD_PER_PAGE = 30;
let usersButton = document.getElementById('users');
let cardContainer = document.getElementById('card-container');
let isLoading = false;
let lastFetchTime = 0;
let counter = 0;

async function getUsers(n) {
    const response = await fetch(`https://randomuser.me/api/?results=${n}`, {
        headers: {'Content-Type': 'application/json'},
    });
    const result = await response.json();
    users = result.results;
}

// async function generateOnePage() {
//     await getUsers(NUMBER_OF_CARD_PER_PAGE);
//
//     if (!cardContainer) return;
//     cardContainer.innerHTML = '';
//     users.forEach(user => {
//         cardContainer.innerHTML += showUser(user);
//     });
// }

function showUser(user) {
    return `
        <div class="user-card">
            <div class="user-info">
                <p class="user-card-title">${user.name.first} ${user.name.last}</p>
                <p class="user-card-text">Age: ${user.dob.age}</p>
                <p class="user-card-text">Location: ${user.location.city}, ${user.location.country}</p>
                <p class="user-card-text">Gender: ${user.gender}</p>
                <p class="user-card-text">Phone: ${user.phone}</p>
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
