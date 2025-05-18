async function getUsers(n) {
    const response = await fetch(`https://randomuser.me/api/?results=${n}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    users = result.results;
}
console.log(localStorage.getItem('user'));
const NUMBER_OF_CARD_PER_PAGE = 30;

async function generateOnePage() {
    await getUsers(NUMBER_OF_CARD_PER_PAGE);

    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) return;
    cardContainer.innerHTML = '';

    users.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
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
            </div>
            <img class="user-img" src="${user.picture.large}" alt="User image">
        </div>`;
}


