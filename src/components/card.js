const cardTemplate = document.querySelector("#card-template").content.querySelector(".places__item");

const createCardElement = (data, {onDelete, onImageClick, onLikeClick}) => {
  const cardElement = cardTemplate.cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardElement.querySelector(".card__title").textContent = data.name;

  deleteButton.addEventListener("click", onDelete);
  cardImage.addEventListener("click", onImageClick);
  likeButton.addEventListener("click", onLikeClick);
  
  return cardElement;
}

const handleDeleteCard = (evt) => {
  evt.target.closest(".card").remove();
}

const handleLikeClick = (evt) => {
  evt.target.classList.contains('card__like-button_is-active') 
  ? evt.target.classList.remove('card__like-button_is-active') 
  : evt.target.classList.add('card__like-button_is-active');
}


export {
  createCardElement,
  handleDeleteCard,
  handleLikeClick
}