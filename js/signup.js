const signupBtn = document.getElementById('signup-btn');
const signupForm = document.getElementById('signup-form');

signupBtn.addEventListener('click', () => {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    cabinetContainer.style.display = 'none';
    setUrl({page: 'signup'});
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = validateSignupForm();
    if (isValid) {
        isRegistered = true;
        signupForm.reset();
        clearFormStyles(signupForm);
        formContainer.style.display = 'none';
        setUrl({page: 'users'});
        document.getElementById("filters").style.display = 'flex';
        generateOnePage()
            .then(() => {
            })
            .catch((error) => {
                console.error('Помилка при генерації:', error);
            });
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
        setItemWithExpire('user', user, 10 * 60);
    }

    return isValid;
}
