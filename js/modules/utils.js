import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";

export async function toggleServiceStatus() {
  let statusMainBlock = document.querySelector(".body-status-block");
  let togglerButton = document.querySelector(".toggler.body-block__toggler");
  let statusIndicator = document.querySelector(".status-indicator");
  if (!togglerButton) {
    return;
  }
  togglerButton.addEventListener("click", async function () {
    let togglerStatus = togglerButton.getAttribute("status");
    statusMainBlock.classList.add("waiting");
    if (togglerStatus == "on") {
      let responce = await impHttp.changeServiceStatus("off");
      statusMainBlock.classList.remove("waiting");
      if (responce.status == 200) {
        togglerButton.setAttribute("status", "off");
        togglerButton.classList.remove("active");
        if (statusIndicator) {
          statusIndicator.classList.add("disabled");
        }
      }
    } else if (togglerStatus == "off") {
      let responce = await impHttp.changeServiceStatus("on");
      statusMainBlock.classList.remove("waiting");
      if (responce.status == 200) {
        togglerButton.setAttribute("status", "on");
        togglerButton.classList.add("active");
        if (statusIndicator) {
          statusIndicator.classList.remove("disabled");
        }
      }
    }
  });
}

export async function addNewGroup() {
  let addGroupBtn = document.querySelector(".add-new-group");
  if (!addGroupBtn) {
    return;
  }

  addGroupBtn.addEventListener("click", function () {
    impPopup.onepAddNewGroupPopup();
  });
}
