import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "860f8737-013c-4470-9264-4d503187c9c3",
    "Content-Type": "application/json",
  },
});

api.getAppInfo().then(([cards]) => {
  cards.forEach((card) => {
    const cardElement = getCardElement(card);
    cardsList.prepend(cardElement);
  });

  api
    .getUserInfo()
    .then((res) => {
      profileName.textContent = res.name;
      profileDescription.textContent = res.about;
      profileAvatar.src = res.avatar;
    })
    .catch((err) => {
      console.error(err);
    });
});

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

// Avatar elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = document.querySelector("#edit-avatar-form");
const avatarInput = document.querySelector("#profile-avatar-input");

// Form elements
const modals = document.querySelectorAll(".modal");
const editModal = document.querySelector("#edit-modal");
const editForm = document.forms["edit-profile-form"];
const closeBtns = document.querySelectorAll(".modal__close-btn");
const newPostSubmitBtn = document.querySelector("#new-card-submit-btn");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

//Card related elements
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

let selectedCard, selectedCardId;

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__container");
const confirmCardDelete = deleteModal.querySelector(".modal__btn_delete");
const cancelCardDelete = deleteModal.querySelector(".modal__btn_cancel");

//Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardCaptionEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardTrashBtn = cardElement.querySelector(".card__trash-btn");

  cardCaptionEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardImageEl.addEventListener("click", (evt) => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalCaption.alt = data.name;
  });

  cardTrashBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

// For all Modals
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeWithEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeWithEscape);
}

closeBtns.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function closeWithEscape(evt) {
  if (evt.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    closeModal(modalOpened);
  }
}

modals.forEach((modal) => {
  modal.addEventListener("mousedown", handlePopupClose);
});

function handlePopupClose(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.currentTarget);
  }
}

// For Edit Profile Modal
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((data) => {
      return data.value;
    })
    .catch(console.error);

  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editModal);
}

profileEditButton.addEventListener("click", (evt) => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editForm, [nameInput, descriptionInput], settings);
  openModal(editModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);

// New Post Modal elements
const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#add-card-modal");
const newPostForm = document.querySelector("#add-card-form");
const newPostLinkInput = newPostForm.querySelector("#add-card-link-input");
const newPostCaptionInput = newPostForm.querySelector(
  "#add-card-caption-input"
);

// For New Post Modal functions
newPostButton.addEventListener("click", (evt) => {
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", handleNewFormSubmit);

function handleNewFormSubmit(evt) {
  evt.preventDefault();
  api
    .addNewCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      console.log(data);
      const cardEl = getCardElement(data);
      cardsList.prepend(cardEl);
    })
    .catch(console.error);

  evt.target.reset();
  disableButton(newPostSubmitBtn, settings);
  closeModal(newPostModal);
}

// For Avatar Modal functions
avatarModalBtn.addEventListener("click", (evt) => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

cancelCardDelete.addEventListener("click", (evt) => {
  evt.preventDefault;
  closeModal(deleteModal);
});

confirmCardDelete.addEventListener("submit", (evt) => {
  evt.preventDefault;
  closeModal(deleteModal);
});

// For Delete Modal functions
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {})
    .catch(console.error);
}

enableValidation(settings);
