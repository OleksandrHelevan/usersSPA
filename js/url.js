function setUrl(query = {}) {
    const url = new URL(window.location.href);
    url.search = ''; // Очищення старих параметрів

    for (const key in query) {
        if (query[key]) {
            url.searchParams.set(key, query[key]);
        }
    }

    history.pushState({}, '', url.toString());
}
