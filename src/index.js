import './pages/index.css';
import { openModal, closeModal, handleCloseModalClick } from './components/modal.js';
import { createCardElement } from './components/card.js';
import { createValidationUtils } from './validation.js';
import { addCard, getCards, getUser, editUser, deleteCard, editAvatar } from './api.js';
import { BUTTON_STATE } from './const.js';

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
const profileImg = document.querySelector('.profile__image');
const editFormJobInput = document.querySelector('.popup__input_type_description');
const addFormPlaceNameInput = document.querySelector('.popup__input_type_card-name');
const formElementEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formElementAddPlace = document.querySelector('.popup__form[name="new-place"]');
const addFormPlaceUrlInput = formElementAddPlace.querySelector('.popup__input_type_url');
const formElementEditAvatar = document.querySelector('.popup__form[name="edit-avatar"]');
const editAvatarFormUrlInput = formElementEditAvatar.querySelector('.popup__input_type_url');
const addFormSubmitButton = formElementAddPlace.querySelector('.popup__button');
const profileFormSubmitButton = formElementEditProfile.querySelector('.popup__button');
const deleteCardModal = document.querySelector('.popup_type_delete_card');
const deleteConfirmCardButton = deleteCardModal.querySelector('.popup__button');

let deletedCardId;

deleteConfirmCardButton.addEventListener('click', evt => {
    evt.preventDefault();
    const submitButton = deleteCardModal.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = BUTTON_STATE.delete;

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
        .finally(() => {
            deletedCardId = null;
            submitButton.textContent = originalText;
        });
});

popupConfirmCardDeleting.addEventListener('click', evt => {
    handleCloseModalClick(evt, () => {});
});

const handleDeleteCardButton = cardId => {
    deletedCardId = cardId;
    openModal(deleteCardModal);
};

Promise.all([getUser(), getCards()])
    .then(([user, cards]) => {
        profileName.textContent = user.name;
        profileJob.textContent = user.about;
        profileImg.style.backgroundImage = `url(${user.avatar})`;

        cards.forEach(data => {
            placesWrap.append(createCardElement(data, user._id, {
                onDelete: handleDeleteCardButton,
                onImageClick: handleImageClick,
            }));
        });
    });

const { clearValidation, enableValidation, toggleButtonState } = createValidationUtils({
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
});

const handleImageClick = evt => {
    openModal(popupImage);
    const popupImageElement = document.querySelector('.popup__image');
    const popupCaptionElement = document.querySelector('.popup__caption');
    popupImageElement.src = evt.target.src;
    popupImageElement.alt = evt.target.alt;
    popupCaptionElement.textContent = evt.target.alt;
};

const handleAvatarClick = () => {
    openModal(popupEditAvatar);
};

profileImg.addEventListener('click', handleAvatarClick);

popupEditAvatar.addEventListener('submit', evt => {
    evt.preventDefault();
    const url = editAvatarFormUrlInput.value.trim();
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = BUTTON_STATE.save;

    editAvatar(url)
        .then(user => {
            profileImg.style.backgroundImage = `url(${user.avatar})`;
        })
        .then(() => {
            closeModal(popupEditAvatar);
            clearValidation(formElementEditAvatar);
        })

        .catch(error => {
            console.error('Ошибка обновления аватара:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
        });
});

popupEditProfile.addEventListener('submit', evt => {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = BUTTON_STATE.save;
    const name = editFormNameInput.value;
    const about = editFormJobInput.value;

    editUser(name, about)
        .then(() => {
            handleCloseModalClick(evt, () => clearValidation(formElementEditProfile));
        })
        .catch(error => {
            console.error('Ошибка обновления профиля:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
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
    profileName.textContent = editFormNameInput.value;
    profileJob.textContent = editFormJobInput.value;
    closeModal(popupEditProfile);
};

formElementEditProfile.addEventListener('submit', handleFormEditProfileSubmit);

formElementAddPlace.addEventListener('input', () => {
    const isValid = formElementAddPlace.checkValidity();
    addFormSubmitButton.disabled = !isValid;
    addFormSubmitButton.classList.toggle('popup__button_disabled', !isValid);
});

const handleCardAddSubmit = evt => {
    evt.preventDefault();
    const submitButton = evt.target.querySelector('.popup__button');
    const originalText = submitButton.textContent;
    submitButton.textContent = BUTTON_STATE.create;
    addCard(addFormPlaceNameInput.value, addFormPlaceUrlInput.value)

        .then(cardData => {
            const newCard = createCardElement(cardData, cardData.owner._id, {
                onDelete: handleDeleteCardButton,
                onImageClick: handleImageClick,
            });
            placesWrap.prepend(newCard);
            formElementAddPlace.reset();
            closeModal(popupNewCard);
            clearValidation(formElementAddPlace);
        })
        .catch(error => {
            console.error('Ошибка добавления карточки:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
        });
};

formElementAddPlace.addEventListener('submit', handleCardAddSubmit);

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.popup');
    modals.forEach(modal => {
        modal.classList.add('popup_is-animated');
    });
});

enableValidation();
