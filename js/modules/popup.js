import * as authinterface from "./authinterface.js";
import * as impHttp from "./http.js";

// 100 предупреждения
// 200 выиграш
// 300 проиграш
// 400 ошибка в игре
// 500 анонс

const isPopupOpened = () => {
  return document.querySelector(".popup") ? true : false;
};

export const open = (text, status, showButton = false, ws = null) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }

  let localUser = localStorage.getItem("user");

  if (localUser) {
    localUser = JSON.parse(localUser);
  }

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "default-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content ${status === 200 ? "popup__content_won" : ""} ${
    status === 300 ? "popup__content_lost" : ""
  }">
    <button class="popup__close"></button>
    <div class="popup__text ${status === 400 ? "popup__text-red" : ""}">
      ${text}
    </div>
    ${
      showButton
        ? `<button class="popup__button">${siteLanguage.profilePage.myGamesPage.statsItem.continueText}</button>`
        : ""
    }
  </div>
</div>`;

  body.appendChild(popupElement);

  if (showButton) {
    const button = body.querySelector(".popup__button");
    button.addEventListener("click", () => {
      close(popupElement);
      ws.close(
        1000,
        JSON.stringify({
          method: "exitGame",
          userId: localUser.userId,
          page: "mainLotoPage",
        })
      );
    });
  }
  const closeButton = document.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });
};

export const openErorPopup = (text, reload = false, hash = null) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "error-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content">
    <div class="popup-header">
      <p>${siteLanguage.profilePage.myGamesPage.statsItem.errorText}</p>
      <img src="img/error-icon.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <button class="popup__button">${siteLanguage.profilePage.myGamesPage.statsItem.closeText}</button>
  </div>
</div>`;

  body.appendChild(popupElement);

  const closeButton = document.querySelector(".popup__button");
  closeButton.addEventListener("click", function () {
    close(popupElement);
    if (reload == true) {
      if (hash) {
        location.hash = hash;
      } else {
        location.hash = "#gamemode-choose";
      }
    }
  });
};

export const onepAddNewGroupPopup = () => {
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "add-new-group-popup");
  popupElement.innerHTML = `
  <div class="popup__content">
  <div class="popup__header">
    <button class="popup__close"></button>
  </div>
  <h2 class="popup__title">Додати групу</h2>
  <p class="popup__text">
    Після додавання, бот відправлятиме повідомлення в цю групу. Також
    потрібно додати бота в групу з правами адміністратора
  </p>
  <div class="popup__sector">
    <label for="group-name-input"></label>
    <input
      type="text"
      name=""
      id="group-name-input"
      placeholder="Назва групи"
    />
  </div>
  <div class="popup__sector">
    <label for="group-id-input"></label>
    <input
      type="number"
      name=""
      id="group-id-input"
      placeholder="Id групи (приклад -10294839)"
    />
  </div>

  <p class="popup__text-error"></p>
  <button class="popup__button">Додати</button>
</div>
`;

  body.appendChild(popupElement);

  const closeButton = document.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });

  let errorBlock = popupElement.querySelector(".popup__text-error");

  // get info

  let submitButton = popupElement.querySelector(".popup__button");
  if (!submitButton) {
    return;
  }

  submitButton.addEventListener("click", async function () {
    if (errorBlock) {
      errorBlock.innerHTML = "";
    }
    let nameInput = popupElement.querySelector("#group-name-input");
    let idInput = popupElement.querySelector("#group-id-input");
    if (!nameInput || !idInput) {
      return;
    }

    nameInput = nameInput.value;
    idInput = idInput.value;

    if (nameInput.length < 1 && idInput.length < 1) {
      if (errorBlock) {
        errorBlock.innerHTML = "Помилка відправки форми! <br> Перевірте дані";
      }
    }

    let response = await impHttp.addNewGroup(nameInput, idInput);
    if (response.status == 200) {
      let newGroupData = response.data;
      authinterface.creteNewGroup(newGroupData);
      close(popupElement);
    } else {
      if (errorBlock) {
        errorBlock.innerHTML = response.data.message;
      }
    }
  });
};

export function close(element) {
  element.remove();
}
