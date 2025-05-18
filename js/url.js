function setUrl({ path, query = {} } = {}) {
    const url = new URL(window.location.origin);

    if (path) {
        url.pathname = path;
    }
    url.search = '';

    for (const key in query) {
        if (query[key]) {
            url.searchParams.set(key, query[key]);
        }
    }

    history.pushState({}, '', url.toString());
}

