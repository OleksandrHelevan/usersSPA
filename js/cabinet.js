let user = getItemWithExpire('user');
let cabinetButton = document.getElementById('cabinet');
function generateCabinet(user) {
    setUrl({ page: `cabinet/${user.firstName}${user.lastName}`});
    container.innerHTML = `
 <div class="card-container" id="card-container">
        <div class="cabinet">
            <h2>Профіль користувача</h2>
            <p><strong>Ім'я:</strong> ${user.firstName}</p>
            <p><strong>Прізвище:</strong> ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Телефон:</strong> ${user.phone}</p>
            <p><strong>Стать:</strong> ${user.sex}</p>
            <p><strong>Дата народження:</strong> ${user.birthDate}</p>
            <p><strong>Місто:</strong> ${user.city}</p>
            <p><strong>Країна:</strong> ${user.country}</p>
        </div>
    `;
}

cabinetButton.addEventListener('click', () => {
    generateCabinet(user);
})