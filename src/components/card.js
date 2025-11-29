const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item');

const makeLikeHandler = ({ dislikeCard, likeCard }) => (evt, cardId) => {
    const cardElement = evt.target.closest('.card');
    const cardLikeCount = cardElement.querySelector('.card__like-count');

    if (!evt.target.classList.contains('card__like-button_is-active')) {
        likeCard(cardId)
            .then(card => {
                cardLikeCount.textContent = card.likes.length;
                evt.target.classList.add('card__like-button_is-active');
            }).catch(err => {
                console.error('Ошибка добавления лайка карточки', err);
            });
    }
    else {
        dislikeCard(cardId)
            .then(card => {
                cardLikeCount.textContent = card.likes.length;
                evt.target.classList.remove('card__like-button_is-active');
            })
            .catch(err => {
                console.error('Ошибка снятия лайка карточки', err);
            });
    }
};

const createCardElement = (card, userId, { onDelete, onImageClick, onLikeClick }) => {
    const cardElement = cardTemplate.cloneNode(true);
    cardElement.setAttribute('data-card-id', card._id);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const cardImage = cardElement.querySelector('.card__image');
    const cardLikeCount = cardElement.querySelector('.card__like-count');

    if (card.likes.some(like => like._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    }
    else {
        likeButton.classList.remove('card__like-button_is-active');
    }

    card.owner._id !== userId ? deleteButton.hidden = true : '';
    cardImage.src = card.link;
    cardImage.alt = card.name;
    cardLikeCount.textContent = card.likes.length;
    cardElement.querySelector('.card__title').textContent = card.name;
    deleteButton.addEventListener('click', () => onDelete(card._id));
    cardImage.addEventListener('click', onImageClick);
    likeButton.addEventListener('click', evt => onLikeClick(evt, card._id));

    return cardElement;
};

export {
    makeLikeHandler,
    createCardElement,
};
