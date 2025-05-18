const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');

loginBtn.addEventListener('click', () => {
    cabinetContainer.style.display = 'none';
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    setUrl({ page: 'login' });
});

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

    let user = getItemWithExpire('user');
    if (user) {
        if (user.firstName === username.value && user.password === password.value) {
            isRegistered = true;

            generateOnePage()
                .then(() => {
                })
                .catch((error) => {
                    console.error('Помилка при генерації:', error);
                });
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

