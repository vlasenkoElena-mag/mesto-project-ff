import './pages/index.css';
import { openModal, closeModal, handleCloseModalClick } from './components/modal.js';
import { createCardElement, makeLikeHandler } from './components/card.js';
import { createValidationUtils } from './validation.js';
import { makeApi } from './api.js';
import { BUTTON_STATE } from './const.js';

const { addCard, getCards, getUser, editUser, deleteCard, editAvatar, likeCard, dislikeCard } = makeApi({
    baseUrl: 'https://nomoreparties.co/v1/higher-front-back-dev',
    authToken: '378d653b-1a2b-486f-80ad-74276afb7abc',
});

const forms = new Map(Array.from(document.forms).map(it => [it.name, it]));

const formElementEditProfile = forms.get('edit-profile');
const formElementAddPlace = forms.get('new-place');
const formElementEditAvatar = forms.get('edit-avatar');

const placesWrap = document.querySelector('.places__list');
const popupEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const popupConfirmCardDeleting = document.querySelector('.popup_type_delete_card');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const editFormNameInput = document.querySelector('.popup__input_type_name');
const profileAvatar = document.querySelector('.profile__image');
const editFormJobInput = document.querySelector('.popup__input_type_description');
const addFormPlaceNameInput = document.querySelector('.popup__input_type_card-name');
const addFormPlaceUrlInput = formElementAddPlace.querySelector('.popup__input_type_url');
const editAvatarFormUrlInput = formElementEditAvatar.querySelector('.popup__input_type_url');
const profileFormSubmitButton = formElementEditProfile.querySelector('.popup__button');
const deleteCardModal = document.querySelector('.popup_type_delete_card');
const deleteConfirmCardButton = deleteCardModal.querySelector('.popup__button');
const popupImageElement = document.querySelector('.popup__image');
const popupCaptionElement = document.querySelector('.popup__caption');

let deletedCardId;

const setButtonProcessText = (buttonElement, text) => {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = text;

    return () => {
        buttonElement.textContent = originalText;
    };
};

deleteConfirmCardButton.addEventListener('click', evt => {
    evt.preventDefault();
    const submitButton = deleteCardModal.querySelector('.popup__button');
    const resetButtonText = setButtonProcessText(submitButton, BUTTON_STATE.delete);

    if (!deletedCardId) {
        return;
    }

    deleteCard(deletedCardId)
        .then(() => {
            const cardToRemove = document.querySelector(`[data-card-id="${deletedCardId}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }
            closeModal(deleteCardModal);
        })
        .catch(error => {
            console.error('Ошибка удаления карточки:', error);
        })
        .finally(() => {
            deletedCardId = null;
            resetButtonText();
        });
});

popupConfirmCardDeleting.addEventListener('click', evt => {
    handleCloseModalClick(evt, () => {});
});

const handleDeleteCardButton = cardId => {
    deletedCardId = cardId;
    openModal(deleteCardModal);
};

const handleImageClick = evt => {
    openModal(popupImage);
    popupImageElement.src = evt.target.src;
    popupImageElement.alt = evt.target.alt;
    popupCaptionElement.textContent = evt.target.alt;
};

const handleAvatarClick = () => {
    openModal(popupEditAvatar);
};

profileAvatar.addEventListener('click', handleAvatarClick);

popupEditAvatar.addEventListener('submit', evt => {
    evt.preventDefault();
    const url = editAvatarFormUrlInput.value.trim();
    const submitButton = evt.target.querySelector('.popup__button');
    const resetButtonText = setButtonProcessText(submitButton, BUTTON_STATE.save);

    editAvatar(url)
        .then(user => {
            profileAvatar.style.backgroundImage = `url(${user.avatar})`;
            closeModal(popupEditAvatar);
        })
        .catch(error => {
            console.error('Ошибка обновления аватара:', error);
        })
        .finally(() => {
            resetButtonText();
        });
});

popupImage.addEventListener('click', evt => handleCloseModalClick(evt, () => {}));

popupNewCard.addEventListener('click', evt => {
    handleCloseModalClick(evt, () => clearValidation(formElementAddPlace));
});

popupEditButton.addEventListener('click', () => {
    openModal(popupEditProfile);
    editFormNameInput.value = profileName.textContent;
    editFormJobInput.value = profileJob.textContent;
    toggleButtonState([editFormNameInput, editFormJobInput], profileFormSubmitButton);
});

popupEditAvatar.addEventListener('click', evt => {
    handleCloseModalClick(evt, () => clearValidation(formElementEditAvatar));
});

popupEditProfile.addEventListener('click', evt => {
    handleCloseModalClick(evt, () => clearValidation(formElementEditProfile));
});

addCardButton.addEventListener('click', () => {
    openModal(popupNewCard);
});

const handleFormEditProfileSubmit = evt => {
    evt.preventDefault();

    const submitButton = evt.target.querySelector('.popup__button');
    const resetButtonText = setButtonProcessText(submitButton, BUTTON_STATE.save);

    editUser(editFormNameInput.value, editFormJobInput.value)
        .then(() => {
            handleCloseModalClick(evt, () => clearValidation(formElementEditProfile));
            profileName.textContent = editFormNameInput.value;
            profileJob.textContent = editFormJobInput.value;
            closeModal(popupEditProfile);
        })
        .catch(error => {
            console.error('Ошибка обновления профиля:', error);
        })
        .finally(() => {
            resetButtonText();
        });
};

formElementEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

const handleCardLike = makeLikeHandler({ dislikeCard, likeCard });

const handleCardAddSubmit = evt => {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const resetButtonText = setButtonProcessText(submitButton, BUTTON_STATE.create);
    addCard(addFormPlaceNameInput.value, addFormPlaceUrlInput.value)

        .then(cardData => {
            const newCard = createCardElement(cardData, cardData.owner._id, {
                onDelete: handleDeleteCardButton,
                onImageClick: handleImageClick,
                onLikeClick: handleCardLike,
            });
            placesWrap.prepend(newCard);
            formElementAddPlace.reset();
            closeModal(popupNewCard);
        })
        .catch(error => {
            console.error('Ошибка добавления карточки:', error);
        })
        .finally(() => {
            resetButtonText();
        });
};

formElementAddPlace.addEventListener('submit', handleCardAddSubmit);

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.popup');
    modals.forEach(modal => {
        modal.classList.add('popup_is-animated');
    });
});

Promise.all([getUser(), getCards()])
    .then(([user, cards]) => {
        profileName.textContent = user.name;
        profileJob.textContent = user.about;
        profileAvatar.style.backgroundImage = `url(${user.avatar})`;

        cards.forEach(data => {
            placesWrap.append(createCardElement(data, user._id, {
                onDelete: handleDeleteCardButton,
                onImageClick: handleImageClick,
                onLikeClick: handleCardLike,
            }));
        });
    })
    .catch(error => {
        console.error('Ошибка загрузки данных:', error);
    });

const { clearValidation, enableValidation, toggleButtonState } = createValidationUtils({
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
});

enableValidation();
