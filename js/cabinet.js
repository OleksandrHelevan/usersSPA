let user;
let cabinetButton = document.getElementById('cabinet');
let cabinetContainer = document.getElementById('cabinet-container');

function generateCabinet() {
    try {
        const user = getItemWithExpire('user');
        if (!user) {
            console.error('Користувач не знайдений або дані прострочені.');
            return;
        }
        setUrl({page: `cabinet/${user.firstName}${user.lastName}`});

        cardContainer.style.display = 'none';
        cabinetContainer.innerHTML = `
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
                </div>`;

    } catch (err) {
        console.error('Помилка при генерації кабінету:', err);
    }
}


cabinetButton.addEventListener('click', () => {
    cabinetContainer.style.display = 'block';
    generateCabinet(user);
})