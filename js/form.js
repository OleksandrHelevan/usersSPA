let container = document.getElementById('container');
let formContainer = document.getElementById('form-container');
let isRegistered = false;
const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const citiesByCountry = {
    'Ukraine': ['Kyiv', 'Lviv', 'Odesa', 'Chernivtsi', 'Khust'],
    'USA': ['New York', 'Los Angeles', 'Chicago']
};

function setItemWithExpire(key, value, expireInSeconds) {
    const now = new Date().getTime();
    const item = {
        value: value,
        expire: now + expireInSeconds * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpire(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    try {
        const item = JSON.parse(itemStr);
        const now = new Date().getTime();

        if (item.expire && now > item.expire) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (e) {
        return itemStr;
    }
}


document.querySelectorAll('.toggle-password').forEach(toggle => {
    let visible = false;

    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;

        if (visible) {
            toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;
            input.type = 'password';
        } else {
            toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>`;
            input.type = 'text';
        }

        visible = !visible;
    });
});

function setError(element, message) {
    const field = element.closest('.field') || element.closest('.sex-field');
    if (!field) return;

    field.classList.add('error');
    field.classList.remove('success');

    const small = field.querySelector('small');
    if (small) {
        small.style.visibility = "visible";
        small.innerText = message;
    } else {
        const newSmall = document.createElement('small');
        newSmall.innerText = message;
        field.appendChild(newSmall);
    }

    if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        element.style.borderColor = 'red';
    }
}

function setSuccess(element) {
    const field = element.closest('.field') || element.closest('.sex-field');
    if (!field) return;

    field.classList.add('success');
    field.classList.remove('error');

    const small = field.querySelector('small');
    if (small) {
        small.style.visibility = "hidden";
        small.innerText = '';
    }

    if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        element.style.borderColor = 'green';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAtLeast18(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}


countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';

    if (selectedCountry && citiesByCountry[selectedCountry]) {
        citiesByCountry[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    } else {
        citySelect.disabled = true;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (getItemWithExpire('user')) {
        formContainer.style.display = 'none';
        document.getElementById("filters").style.display = 'flex';
        generateOnePage()
            .then(() => {
            })
            .catch((error) => {
                console.error('Помилка при генерації:', error);
            });
    }else{
        formContainer.style.display = 'block';
        document.getElementById("filters").style.display = 'none';
    }
})
