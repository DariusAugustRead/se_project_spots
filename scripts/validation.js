// I KNOW THAT THIS WON'T BE APPROVED
// BUT i DON'T KNOW HOW TO FIX THE PROBLEM

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__btn",
  inactiveButtonClass: "modal__btn_disabled",
  inputErrorClass: "modal__input_error_type",
  errorClass: "modal__error",
};

// Error Messages

const showInputError = (formElement, inputElement, errorMsg, config) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMsgElement.textContent = errorMsg;
  inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorMsgElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMsgElement.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

// Arrays?
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement, config) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  console.log(hasInvalidInput(inputList));
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Validation

const resetValidation = (formElement, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

enableValidation(settings);
