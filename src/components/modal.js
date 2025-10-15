export const openModal = (modal) => {
    modal.classList.add('popup_is-opened');
}

export const closeModal = (modal) => {
    modal.classList.remove('popup_is-opened');
}