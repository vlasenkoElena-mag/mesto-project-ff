import './pages/index.css';
import './components/modal.js'
// import './images/avatar.jpg';
// import './images/logo.svg';
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
// import { initialCards } from './components/card.js';
// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
// Темплейт карточки
// const cardTemplate = document.querySelector("#card-template").content.querySelector(".places__item");

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const popupEditButton = document.querySelector('.profile__edit-button');
const profileAddButton= document.querySelector('.profile__add-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupCloseButton = document.querySelector('.popup__close');

// const handleOpenModalEdit = openModal;

// function createCardElement(data, onDelete) {
//   const cardElement = cardTemplate.cloneNode(true);
//   const deleteButton = cardElement.querySelector(".card__delete-button");

//   const cardImage = cardElement.querySelector(".card__image");
//   cardImage.src = data.link;
//   cardImage.alt = data.name;

//   cardElement.querySelector(".card__title").textContent = data.name;

//   deleteButton.addEventListener("click", onDelete);
//   return cardElement;
// }

// должна быть отдельной функций, можно стрелочной
function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
}

// можно сделать и через простой цикл
initialCards.forEach((data) => {
  placesWrap.append(createCardElement(data, handleDeleteCard));
});

popupEditButton.addEventListener('click', () => {
  document.addEventListener('keydown', (evt) => handleEscClick(evt, popupEditProfile));
  openModal(popupEditProfile);
});

profileAddButton.addEventListener('click', () => {
  document.addEventListener('keydown', (evt) => handleEscClick(evt, popupNewCard));
  openModal(popupNewCard);
});

const handleCloseClick = (evt, modal) => {
  if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
    closeModal(modal);
  }
}

document.addEventListener('click', (evt) => handleCloseClick(evt, popupEditProfile));
document.addEventListener('click', (evt) => handleCloseClick(evt, popupNewCard));

const handleEscClick = (evt, modal) => {
  if (evt.key === 'Escape') {
    closeModal(modal);
    document.removeEventListener('keydown', handleEscClick);
  }
}

// document.addEventListener('keydown', (evt) => handleEscClick(evt, popupEditProfile));
// document.addEventListener('keydown', (evt) => handleEscClick(evt, popupNewCard));
