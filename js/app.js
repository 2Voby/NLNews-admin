import * as impAuth from "./modules/authorization.js";

import * as impPopup from "./modules/popup.js";

impAuth.isAuth();

impAuth.loginForm();

// если сайт стал офлайн то показываем окно ошибки

window.addEventListener("offline", (event) => {
  impPopup.openConnectionErorPopup(`Помилка підключення`);
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
