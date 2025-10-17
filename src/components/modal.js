const openModal = (modal) => {
    modal.classList.add('popup_is-opened');
};

const closeModal = (modal) => {
    modal.classList.remove('popup_is-opened');
};

const makeEscKeydownHandler = (popupElement) => {
    const handleEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        closeModal(popupElement);
        document.removeEventListener('keydown', handleEscKeydown);
      }
    }
  
    return handleEscKeydown;
};

const makeOverlayClickHandler = (...escHandlers) => (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
        const modal = evt.target.closest('.popup') || evt.target;
        closeModal(modal);
        escHandlers.forEach(handler => document.removeEventListener('keydown', handler));
    }
};

export {
    openModal,
    closeModal,
    makeEscKeydownHandler,
    makeOverlayClickHandler
};