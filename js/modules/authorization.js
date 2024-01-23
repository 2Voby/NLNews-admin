import * as impHttpRequests from "./http.js";
import * as impInterface from "./authinterface.js";

import * as impPopup from "./popup.js";

export function loginForm() {
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formHeaderText = form.querySelector(".form-header__heading");
  formHeaderText.innerHTML = "Вхід";
  let formBody = form.querySelector(".form-body");

  let errorBlock = form.querySelector(".auth-form-error");
  if (errorBlock) {
    errorBlock.innerHTML = "";
  }

  formBody.innerHTML = `<div class="form-body-login">
  <p class="username-label">username</p>
  <input
    type="text"
    placeholder="Your username"
    class="form-body__input username-input"
  />
  <p class="password-label">Password</p>
  <input
    type="password"
    placeholder="Your password"
    class="form-body__input password-input"
  />
  <button class="form-body__button login-button">Увійти</button>
</div>`;

  let submitButton = registrationPopup.querySelector(".login-button");

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    let email = registrationPopup.querySelector(".username-input").value;
    let password = registrationPopup.querySelector(".password-input").value;

    let response = await impHttpRequests.login(email, password);

    if (response.status == 200) {
      // show auth interface
      registrationPopup.classList.remove("opened");
      let user = {
        userId: response.data.user.id,
        email: response.data.user.email,
      };

      localStorage.setItem("user", JSON.stringify(user));

      impInterface.showUserInterface();
    } else {
      const errorBlock = document.querySelector(".auth-form-error");
      errorBlock.innerHTML = response.data.message;
    }
  });
}

export async function isAuth() {
  let response = await impHttpRequests.checkAuth();

  if (response.status == 200 || response.statusText == "OK") {
    let registrationPopup = document.querySelector(".registration");
    registrationPopup.classList.remove("opened");
    let user = {
      userId: response.data.user.id,
      email: response.data.user.email,
    };
    localStorage.setItem("user", JSON.stringify(user));
    impInterface.showUserInterface(response.data);

    return true;
  } else {
    return false;
  }
}
