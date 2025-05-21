function toggleLike(user) {
    const likedUsers = JSON.parse(localStorage.getItem('likedUsers') || '[]');
    const userId = user.login.uuid;

    const index = likedUsers.findIndex(u => u.login.uuid === userId);
    if (index === -1) {
        likedUsers.push(user);
    } else {
        likedUsers.splice(index, 1);
    }

    localStorage.setItem('likedUsers', JSON.stringify(likedUsers));
}

cardContainer.addEventListener('click', (e) => {
    if (e.target.closest('.like')) {
        const button = e.target.closest('.like');
        const userId = button.dataset.userId;
        const user = users.find(u => u.login.uuid === userId);
        if (!user) return;

        toggleLike(user);
        button.classList.toggle('liked');
    }
});

document.getElementById('favorites').addEventListener('click', () => {
    const likedUsers = JSON.parse(localStorage.getItem('likedUsers') || '[]');
    cardContainer.innerHTML = '';
    likedUsers.forEach(user => {
        cardContainer.innerHTML += showUser(user);
    });
});
