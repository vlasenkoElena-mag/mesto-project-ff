const isValid = input => input.validity.valid;

const setErrorMessage = input => {
    if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage);
    }
    else {
        input.setCustomValidity('');
    }
};

export const createValidationUtils = ({
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
}) => {
    const getInputs = formElement => {
        return Array.from(formElement.querySelectorAll(inputSelector));
    };

    const hasInvalidInput = inputList => {
        return inputList.some(inputElement => !inputElement.validity.valid);
    };

    const toggleButtonState = (inputList, submitButton) => {
        if (hasInvalidInput(inputList)) {
            submitButton.disabled = true;
            submitButton.classList.add(inactiveButtonClass);
        }
        else {
            submitButton.disabled = false;
            submitButton.classList.remove(inactiveButtonClass);
        }
    };

    const setEventListeners = form => {
        const inputs = getInputs(form);
        const submitButton = form.querySelector(submitButtonSelector);
        toggleButtonState(inputs, submitButton);
        inputs.forEach(input => {
            input.addEventListener('input', evt => {
                setErrorMessage(evt.target);
                checkInputValidity(evt.target);
                toggleButtonState(inputs, submitButton);
            });
        });
    };

    const getErrorElement = inputId => document.querySelector(`.${inputId}-error`);

    const showInputError = formInput => {
        formInput.classList.add(inputErrorClass);
        const errorElement = getErrorElement(formInput.id);
        errorElement.textContent = formInput.validationMessage;
    };

    const hideInputError = formInput => {
        formInput.classList.remove(inputErrorClass);
        const errorElement = getErrorElement(formInput.id);
        formInput.setCustomValidity('');
        errorElement.textContent = '';
    };

    const checkInputValidity = formInput => {
        return !isValid(formInput)
            ? showInputError(formInput)
            : hideInputError(formInput);
    };

    const clearValidation = formElement => {
        const submitButton = formElement.querySelector(submitButtonSelector);
        const inputElements = getInputs(formElement);
        inputElements.forEach(hideInputError);
        toggleButtonState(inputElements, submitButton);
    };

    const enableValidation = () => {
        const forms = Array.from(document.forms);
        forms.forEach(form => {
            setEventListeners(form);
        });
    };

    return { clearValidation, enableValidation, toggleButtonState, checkInputValidity };
};
