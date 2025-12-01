const openModal = modal => {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscKeydown);
};

const closeModal = modal => {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscKeydown);
};

const handleEscKeydown = evt => {
    if (evt.key === 'Escape') {
        const modal = document.querySelector('.popup_is-opened');
        if (modal) {
            closeModal(modal);
        }
    }
};

const handleCloseModalClick = evt => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
        const modal = evt.target.closest('.popup') || evt.target;
        closeModal(modal);
    }
};

export {
    openModal,
    closeModal,
    handleCloseModalClick,
};
