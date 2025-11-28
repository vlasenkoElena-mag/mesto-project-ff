const config = {
    baseUrl: 'https://nomoreparties.co/v1/higher-front-back-dev',
    headers: {
        'authorization': '378d653b-1a2b-486f-80ad-74276afb7abc',
        'Content-Type': 'application/json',
    },
};

const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

export const getUser = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers,
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const getCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers,
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const editUser = (name, job) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name,
            about: job,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const editAvatar = url => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: url,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const addCard = (name, link) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name,
            link,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const deleteCard = cardId => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
        body: JSON.stringify({
            cardId,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const likeCard = cardId => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers,
        body: JSON.stringify({
            cardId,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};

export const dislikeCard = cardId => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
        body: JSON.stringify({
            cardId,
        }),
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        });
};
