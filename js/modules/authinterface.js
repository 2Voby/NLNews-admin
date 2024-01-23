import * as impUtils from "./utils.js";
import * as impHttp from "./http.js";

export async function showUserInterface() {
  let headerBlock = document.querySelector("header");
  if (headerBlock) {
    headerBlock.innerHTML = ` 
    <div class="header-block">
      <div class="header__container"><h1>НЛ News</h1></div>
    </div>
    `;
  }

  let serviceResponse = await impHttp.getServiceStatus();

  if (serviceResponse.status == 200) {
    console.log(serviceResponse.data);
    let mainBlock = document.querySelector("main");
    if (mainBlock) {
      mainBlock.innerHTML = `
    <div class="main__container header__padding">
    <div class="controlls">
      <div class="controlls__body body-controlls ">
        <div class="body-controlls__block body-block body-status-block ">
          <div class="body-block__title">
            <h3>Статус сервісу:</h3>
            <div class="status-indicator ${
              serviceResponse.data.serviceStatus == "on" ? "" : "disabled"
            }"></div>
          </div>

          <div status="${
            serviceResponse.data.serviceStatus == "on" ? "on" : "off"
          }" class="toggler body-block__toggler ${
        serviceResponse.data.serviceStatus == "on" ? "active" : ""
      } ">
            <div class="toggler__item">Увімкнено</div>
            <div class="toggler__item">Вимкнено</div>
          </div>
        </div>
        <div class="body-controlls__block body-block body-groups-block">
          <div class="body-block__title">
            <h3>Відправка в групи</h3>
            <div class="add-new-group">+</div>
          </div>

          <div class="body-groups-block__main groups-main">
            
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

      let groupsResponse = await impHttp.getAllGroups();
      if (groupsResponse.status == 200) {
        let groupsBlock = document.querySelector(".groups-main");
        if (!groupsBlock) {
          return;
        }
        let groupsData = groupsResponse.data;

        groupsData.forEach((groupData) => {
          creteNewGroup(groupData);
        });
      }

      impUtils.toggleServiceStatus();
      impUtils.addNewGroup();
    }
  }
}

export function creteNewGroup(groupData, groupsBlock = null) {
  if (!groupsBlock) {
    groupsBlock = document.querySelector(".groups-main");
  }
  if (!groupsBlock) {
    return;
  }
  let groupItem = document.createElement("div");
  groupItem.classList.add("groups-main__item");
  if (!groupData.isActive) {
    groupItem.classList.add("disabled");
  }
  groupItem.setAttribute("itemId", groupData._id);
  groupItem.innerHTML = ` 
    <p class="name">${groupData.name}</p>
    <div class="chat-id">${groupData.chatID}</div>
    <button status=${
      groupData.isActive ? "on" : "off"
    } class="group-active"></button>
    <button class="group-remove">x</button>
  `;
  groupsBlock.appendChild(groupItem);

  let changeStatusButton = groupItem.querySelector("button.group-active");

  if (changeStatusButton) {
    changeStatusButton.addEventListener("click", async function () {
      let status = changeStatusButton.getAttribute("status");
      let response = await impHttp.changeGroupStatus(groupData._id);
      if (response.status == 200) {
        let status = response.data.isActive;
        console.log(status);
        changeStatusButton.setAttribute(
          "status",
          `${status == true ? "on" : "off"}`
        );
        if (status == true) {
          groupItem.classList.remove("disabled");
        } else {
          groupItem.classList.add("disabled");
        }
      }
    });
  }

  let thisButton = groupItem.querySelector(".group-remove");
  if (thisButton) {
    thisButton.addEventListener("click", async function () {
      let deleteResponse = await impHttp.deleteGroup(groupData._id);
      if (deleteResponse.status == 200) {
        groupItem.remove();
      }
    });
  }
}
