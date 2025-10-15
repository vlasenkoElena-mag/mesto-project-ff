import './pages/index.css';
import './components/modal.js'
import { createCardElement } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

export const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

const placesWrap = document.querySelector(".places__list");
const popupEditButton = document.querySelector('.profile__edit-button');
const profileAddButton= document.querySelector('.profile__add-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const editFormNameInput = document.querySelector('.popup__input_type_name');
const editFormJobInput = document.querySelector('.popup__input_type_description');
const addFormPlaceNameInput = document.querySelector('.popup__input_type_card-name');
const addFormPlaceUrlInput = document.querySelector('.popup__input_type_url');
const formElementEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formElementAddPlace = document.querySelector('.popup__form[name="new-place"]');

const handleDeleteCard = (evt) => {
  evt.target.closest(".card").remove();
}

const handleImageClick = (evt) => {
  document.addEventListener('keydown', handleEscImage);
  openModal(popupImage);
  const popupImageElement = document.querySelector('.popup__image');
  const popupCaptionElement = document.querySelector('.popup__caption');
  popupImageElement.src = evt.target.src;
  popupImageElement.alt = evt.target.alt;
  popupCaptionElement.textContent = evt.target.alt;
}

const handleLikeClick = (evt) => {
  evt.target.classList.contains('card__like-button_is-active') ? evt.target.classList.remove('card__like-button_is-active') : evt.target.classList.add('card__like-button_is-active');
}

initialCards.forEach((data) => {
  placesWrap.append(createCardElement(data, {onDelete: handleDeleteCard, onImageClick: handleImageClick, onLikeClick: handleLikeClick}));
});

const handleEscEdit = (evt) => {
  if (evt.key === 'Escape') {
    closeModal(popupEditProfile);
    document.removeEventListener('keydown', handleEscEdit);
  }
}

const handleEscNewCard = (evt) => {
  if (evt.key === 'Escape') {
    closeModal(popupNewCard);
    document.removeEventListener('keydown', handleEscNewCard);
  }
}

const handleEscImage = (evt) => {
  if (evt.key === 'Escape') {
    closeModal(popupImage);
    document.removeEventListener('keydown', handleEscImage);
  }
}

const handleCloseClick = (evt) => {

  if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
    const modal = evt.target.closest('.popup') || evt.target;
    
    if (modal === popupEditProfile) {
      closeModal(popupEditProfile);
      document.removeEventListener('keydown', handleEscEdit);
    } else if (modal === popupNewCard) {
      closeModal(popupNewCard);
      document.removeEventListener('keydown', handleEscNewCard);
    } else if (modal === popupImage) {
      closeModal(popupImage);
      document.removeEventListener('keydown', handleEscImage);
    }
  }
}

document.addEventListener('click', handleCloseClick);

popupEditButton.addEventListener('click', () => {
  document.addEventListener('keydown', handleEscEdit);
  openModal(popupEditProfile);
  editFormNameInput.value = profileName.textContent;
  editFormJobInput.value = profileJob.textContent;
});

profileAddButton.addEventListener('click', () => {
  document.addEventListener('keydown', handleEscNewCard);
  openModal(popupNewCard);
});

const handleFormEditProfileSubmit = (evt) => {
  evt.preventDefault();
  profileName.textContent = editFormNameInput.value;
  profileJob.textContent = editFormJobInput.value;
  document.removeEventListener('keydown', handleEscEdit);
  closeModal(popupEditProfile);
}

formElementEditProfile.addEventListener('submit', handleFormEditProfileSubmit); 

formElementAddPlace.addEventListener('input', () => {
  const submitButton = formElementAddPlace.querySelector('.popup__button');
  const isValid = formElementAddPlace.checkValidity();
  submitButton.disabled = !isValid;
  submitButton.classList.toggle('popup__button_disabled', !isValid);
});

const handleCardAddSubmit = (evt) => {
  evt.preventDefault();
  placesWrap.prepend(createCardElement(
    {
      name: addFormPlaceNameInput.value, 
      link: addFormPlaceUrlInput.value
    }, 
    {
      onDelete: handleDeleteCard,
      onImageClick: handleImageClick,
      onLikeClick: handleLikeClick
    }));
  document.removeEventListener('keydown', handleEscEdit);
  formElementAddPlace.reset();
  closeModal(popupNewCard);
}

formElementAddPlace.addEventListener('submit', handleCardAddSubmit);