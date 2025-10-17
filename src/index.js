import './pages/index.css';
import './components/modal.js'
import { createCardElement, handleDeleteCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, handleCloseModalClick } from './components/modal.js';
import { initialCards } from './components/cards.js';

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
const addFormSubmitButton = formElementAddPlace.querySelector('.popup__button');

const handleImageClick = (evt) => {
  openModal(popupImage);
  const popupImageElement = document.querySelector('.popup__image');
  const popupCaptionElement = document.querySelector('.popup__caption');
  popupImageElement.src = evt.target.src;
  popupImageElement.alt = evt.target.alt;
  popupCaptionElement.textContent = evt.target.alt;
}

popupEditProfile.addEventListener('click', handleCloseModalClick);
popupImage.addEventListener('click', handleCloseModalClick);
popupNewCard.addEventListener('click', handleCloseModalClick);

popupEditButton.addEventListener('click', () => {
  openModal(popupEditProfile);
  editFormNameInput.value = profileName.textContent;
  editFormJobInput.value = profileJob.textContent;
});

profileAddButton.addEventListener('click', () => {
  openModal(popupNewCard);
});

const handleFormEditProfileSubmit = (evt) => {
  evt.preventDefault();
  profileName.textContent = editFormNameInput.value;
  profileJob.textContent = editFormJobInput.value;
  closeModal(popupEditProfile);
}

formElementEditProfile.addEventListener('submit', handleFormEditProfileSubmit); 

formElementAddPlace.addEventListener('input', () => {
  const isValid = formElementAddPlace.checkValidity();
  addFormSubmitButton.disabled = !isValid;
  addFormSubmitButton.classList.toggle('popup__button_disabled', !isValid);
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
    formElementAddPlace.reset();
    closeModal(popupNewCard);
  }
  
  formElementAddPlace.addEventListener('submit', handleCardAddSubmit);
  
  document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.popup');
    modals.forEach(modal => {
    modal.classList.add('popup_is-animated');
  });
});

for (const data of initialCards) {
 placesWrap.append(createCardElement(data, {onDelete: handleDeleteCard, onImageClick: handleImageClick, onLikeClick: handleLikeClick}));
};