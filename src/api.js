import { makeApiUtils } from './api-utils';

export const makeApi = ({ baseUrl, authToken }) => {
    const { getRequest, deleteRequest, patchRequest, postRequest, putRequest } = makeApiUtils(authToken);

    const meUrl = `${baseUrl}/users/me`;
    const avatarUrl = `${meUrl}/avatar`;
    const cardsUrl = `${baseUrl}/cards`;
    const likesUrl = `${cardsUrl}/likes`;

    const addId = (url, id) => `${url}/${id}`;

    return ({
        getUser: () => getRequest(meUrl),
        editUser: (name, about) => patchRequest(meUrl, { name, about }),
        editAvatar: url => patchRequest(avatarUrl, { avatar: url }),
        getCards: () => getRequest(cardsUrl),
        addCard: (name, link) => postRequest(cardsUrl, { name, link }),
        deleteCard: cardId => deleteRequest(addId(cardsUrl, cardId)),
        likeCard: cardId => putRequest(addId(likesUrl, cardId)),
        dislikeCard: cardId => deleteRequest(addId(likesUrl, cardId)),
    });
};
