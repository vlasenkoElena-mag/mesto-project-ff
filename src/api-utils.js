export const makeApiUtils = authToken => ({
    deleteRequest: makeNoBodyRequestFactory('DELETE', authToken),
    putRequest: makeNoBodyRequestFactory('PUT', authToken),
    getRequest: makeNoBodyRequestFactory('GET', authToken),
    postRequest: makeBodyRequestFactory('POST', authToken),
    patchRequest: makeBodyRequestFactory('PATCH', authToken),
});

const makeBodyRequestFactory = (method, authToken) => (url, body) => fetch(url, {
    method,
    headers: {
        'authorization': authToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
}).then(loadResult(url));

const makeNoBodyRequestFactory = (method, authToken) => url => fetch(url, {
    method,
    headers: {
        authorization: authToken,
    },
}).then(loadResult(url));

const loadResult = url => resp => {
    if (!resp.ok) {
        return Promise.reject(new Error(`запрос вернул ошибку. Url: ${url}, status: ${resp.status}`));
    }

    return resp.json();
};
