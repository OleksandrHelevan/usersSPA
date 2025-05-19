function setUrl(params = {}) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    history.replaceState({}, '', url);
}
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');

    if (page === 'signup') {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
    } else if (page === 'login') {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        signupBtn.classList.remove('active');
        loginBtn.classList.add('active');
    } else if (page === 'users') {
        if (isRegistered) {
            signupForm.style.display = 'none';
            loginForm.style.display = 'none';
            generateOnePage()
                .then(() => {
                })
                .catch((error) => {
                    console.error('Помилка при генерації:', error);
                });
        }
    }
});