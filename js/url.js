function setUrl({path, query = {}} = {}) {
    const url = new URL(window.location.href);
    L

    if (path) {
        url.pathname = path.startsWith('/') ? path : '/' + path;
    }
    url.search = '';

    for (const key in query) {
        if (query[key]) {
            url.searchParams.set(key, query[key]);
        }
    }

    history.pushState({}, '', url.toString());
}
