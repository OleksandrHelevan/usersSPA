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

const params = new URLSearchParams(window.location.search);
let isRegistered = false;
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
let container = document.getElementById('container');

signupBtn.addEventListener('click', () => {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    setUrl({ query: { page: "signup" } });



});

loginBtn.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    setUrl({ query: { page: "login" } });
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = validateSignupForm();
    if (isValid) {
        isRegistered = true;
        signupForm.reset();
        clearFormStyles(signupForm);
        container.innerHTML = '<div id="card-container" class="card-container"></div>';
        generateOnePage();
    }

});


function validateSignupForm() {
    let isValid = true;

    const firstName = document.getElementById('first-name');
    if (firstName.value.trim() === '') {
        setError(firstName, 'First name is required');
        isValid = false;
    } else {
        setSuccess(firstName);
    }

    const lastName = document.getElementById('last-name');
    if (lastName.value.trim() === '') {
        setError(lastName, 'Last name is required');
        isValid = false;
    } else {
        setSuccess(lastName);
    }

    const email = document.getElementById('email');
    if (!isValidEmail(email.value.trim())) {
        setError(email, 'Invalid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    const password = document.getElementById('password');
    if (password.value.length < 6) {
        setError(password, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        setSuccess(password);
    }

    const confirmPassword = document.getElementById('confirm-password');
    if (confirmPassword.value !== password.value || confirmPassword.value.length === 0) {
        setError(confirmPassword, 'Passwords do not match');
        isValid = false;
    } else {
        setSuccess(confirmPassword);
    }

    const phone = document.getElementById('phone');
    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        setError(phone, 'Phone must be in format +380XXXXXXXXX');
        isValid = false;
    } else {
        setSuccess(phone);
    }

    const dob = document.getElementById('dob');
    if (dob.value === '') {
        setError(dob, 'Date of birth is required');
        isValid = false;
    } else if (!isAtLeast18(dob.value)) {
        setError(dob, 'You must be at least 18 years old');
        isValid = false;
    } else {
        setSuccess(dob);
    }

    const sex = document.querySelector('input[name="sex"]:checked');
    const sexField = document.querySelector('.sex-field');
    if (!sex) {
        setError(sexField, 'Please select your gender');
        isValid = false;
    } else {
        setSuccess(sexField);
    }

    const country = document.getElementById('country');
    if (country.value === '') {
        setError(country, 'Select a country');
        isValid = false;
    } else {
        setSuccess(country);
    }

    const city = document.getElementById('city');
    if (city.value === '') {
        setError(city, 'Select a city');
        isValid = false;
    } else {
        setSuccess(city);
    }

    if (isValid) {
        let user = {
            "firstName": firstName.value,
            "lastName": lastName.value,
            "email": email.value,
            "phone": phone.value,
            "password": password.value,
            "birthDate": dob.value,
            "sex": sex.value,
            "country": country.value,
            "city": city.value,
        }
        localStorage.setItem('user', JSON.stringify(user));
    }

    return isValid;
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = validateLoginForm();
    if (isValid) {
        loginForm.reset();
        clearFormStyles(loginForm);
    }
});

function validateLoginForm() {
    let isValid = true;

    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');

    if (username.value.trim() === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(username);
    }

    if (password.value.trim() === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else {
        setSuccess(password);
    }

    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if(user.firstName === username.value && user.password === password.value) {
            isRegistered = true;
            container.innerHTML = '<div id="card-container" class="card-container"></div>';
            generateOnePage();
        } else {
            setError(username, 'Incorrect login or password');
            setError(password, '');
            isValid = false;
        }
    } else {
        setError(username, 'User not found');
        setError(password, '');
        isValid = false;
    }


    return isValid;
}

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

function clearFormStyles(form) {
    form.querySelectorAll('.field, .sex-field').forEach(field => {
        field.classList.remove('error', 'success');
        const small = field.querySelector('small');
        if (small) {
            small.style.visibility = "hidden";
            small.innerText = '';
        }
        const input = field.querySelector('input, select');
        if (input) {
            input.style.borderColor = '';
        }
    });
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


const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');

const citiesByCountry = {
    'Ukraine': ['Kyiv', 'Lviv', 'Odesa', 'Chernivtsi', 'Khust'],
    'USA': ['New York', 'Los Angeles', 'Chicago']
};

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
