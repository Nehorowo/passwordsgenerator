import {
  CHARS,
  SUCCESS_MESSAGE_BACKGROUND_COLOR,
  ERROR_MESSAGE_BACKGROUND_COLOR,
  COPIED_MESSAGE,
  SAVED_MESSAGE,
  ERROR_MESSAGE,
  DELETED_MESSAGE,
  passwordElement,
  passwordLengthElement,
  copyText,
  passwordUppercaseElement,
  passwordLowercaseElement,
  passwordSpecialCharsElement,
  passwordNoNumbersElement,
  savedPasswordsList,
  generateBtn,
  copyBtn,
  saveBtn,
  sortPasswordsByDate,
  sortPasswordsByDateNew,
  searchBySavedPassword
} from "./utils";
import { generateToast } from "./toast";
import { guard } from "./guard";
import { createLoader } from "./loader";

let length = 8;
let isUppercase = false;
let isLowercase = false;
let isNoSpecialChars = false;
let isNoNumbers = false;

let passwordsArray = [];
let token = "";

const generatePassword = () => {
  let password = "";

  for (let i = 0; i <= length; i++) {
    let randomNumber = Math.floor(Math.random() * CHARS.length);

    if (isUppercase) {
      password += CHARS.substring(randomNumber, randomNumber + 1).toUpperCase();
    } else if (isLowercase) {
      password += CHARS.substring(randomNumber, randomNumber + 1).toLowerCase();
    } else {
      password += CHARS.substring(randomNumber, randomNumber + 1);
    }
  }

  if (isNoSpecialChars) {
    password = password.replace(/[^a-zA-Z0-9]/g, "");
  }

  if (isNoNumbers) {
    password = password.replace(/[^a-zA-Z!@#$%^&*()]/g, "");
  }

  passwordElement.value = password;
};

const copyPassword = () => {
  copyText.select();
  document.execCommand("copy");
};

const editPassword = async ({ newPassword, key }) => {
  const response = await fetch("https://j7rrbn.deta.dev/edit", {
    method: "PATCH",
    body: JSON.stringify({ newPassword, key }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-type": "application/json; charset=UTF-8"
    }
  });

  if (response.status === 201) {
    const { items } = await getSavedPasswords();
    renderPasswords(items);
  }
};

const renderPasswords = (passwordArray) => {
  savedPasswordsList.replaceChildren();
  passwordArray.forEach((element) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const submitEditButton = document.createElement("button");

    li.setAttribute("class", "passwordsListsElement");
    li.appendChild(document.createTextNode(element.savedPassword));
    savedPasswordsList.appendChild(li);
    savedPasswordsList.lastChild.setAttribute("id", `${element.key}`);

    deleteButton.appendChild(document.createTextNode("delete"));
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.setAttribute("id", `${element.key}`);

    editButton.appendChild(document.createTextNode("edit"));
    editButton.setAttribute("class", "editButton");
    editButton.setAttribute("id", `${element.key}`);

    submitEditButton.appendChild(document.createTextNode("submit"));
    submitEditButton.setAttribute("class", "submitEditButton");
    submitEditButton.setAttribute("id", `${element.key}`);

    li.appendChild(deleteButton);
    li.appendChild(editButton);

    deleteButton.addEventListener("click", (event) => {
      deletePassword(event);
    });
    editButton.addEventListener("click", (event) => {
      const li = document.getElementById(event.target.id);
      const password = li.childNodes[0].wholeText;
      const input = document.createElement("input");
      // console.log("li:", li);
      // console.log("input:", input);
      // console.log("password:", password);
      input.value = password;
      li.replaceChild(input, li.childNodes[0]);
      li.appendChild(submitEditButton);
      submitEditButton.addEventListener("click", async (event) => {
        await editPassword({ newPassword: input.value, key: event.target.id });
      });
    });
  });
};

const getSavedPasswords = async () => {
  const loader = createLoader();
  loader.show();

  const response = await fetch("https://j7rrbn.deta.dev/saved", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  }); // Extracting data as a JSON Object from the response

  if (response.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    const data = { token: refreshToken };
    const refreshTokenResponse = await fetch("https://j7rrbn.deta.dev/token", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const newToken = await refreshTokenResponse.json();
    console.log("newToken:", newToken);
    loader.hide();
  }

  const { items } = await response.json();

  loader.hide();
  return items;
};

const deletePassword = async (event) => {
  const result = await guard({ title: "Удалить пароль?" });

  if (result) {
    const response = await fetch(
      `https://j7rrbn.deta.dev/delete/${event.target.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    if (response.status === 200) {
      generateToast({
        message: DELETED_MESSAGE,
        backgroundColor: SUCCESS_MESSAGE_BACKGROUND_COLOR
      });
    } else {
      generateToast({
        message: ERROR_MESSAGE,
        backgroundColor: ERROR_MESSAGE_BACKGROUND_COLOR
      });
    }

    const passwords = await getSavedPasswords();

    const sortedByDate = sortPasswordsByDate(passwords);

    renderPasswords(sortedByDate);
  }
};

const savePassword = async () => {
  const data = { savedPassword: passwordElement.value };

  const response = await fetch("https://j7rrbn.deta.dev/saved", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  });

  if (response.status !== 403) {
    generateToast({
      message: SAVED_MESSAGE,
      backgroundColor: SUCCESS_MESSAGE_BACKGROUND_COLOR
    });
    passwordsArray = await getSavedPasswords();

    const sortedByDate = sortPasswordsByDate(passwordsArray);

    renderPasswords(sortedByDate);
  } else {
    generateToast({
      message: ERROR_MESSAGE,
      backgroundColor: ERROR_MESSAGE_BACKGROUND_COLOR
    });
  }
};

const init = async () => {
  token = localStorage.getItem("token");

  if (!token) {
    document.getElementById("savebtn").setAttribute("class", "hide");
  } else {
    const currentPasswords = await getSavedPasswords();
    const sortedByDate = sortPasswordsByDate(currentPasswords, "asc");
    renderPasswords(sortedByDate);

    //sorting
    const sortButton = document.createElement("button");
    sortButton.appendChild(document.createTextNode("sort"));
    sortButton.setAttribute("class", "sortButton");
    const toggleSort = sortPasswordsByDateNew(currentPasswords);
    sortButton.addEventListener("click", async () => {
      renderPasswords(toggleSort());
    });
    document
      .querySelector(".listWrapper")
      .insertAdjacentElement("afterbegin", sortButton);

    //search
    const searchInput = document.createElement("input");
    searchInput.setAttribute("id", "searchInput");
    document
      .querySelector(".listWrapper")
      .insertAdjacentElement("afterbegin", searchInput);

    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value;
      const searchResults = searchBySavedPassword(currentPasswords, searchTerm);

      renderPasswords(searchResults);
      console.log("searchResults:", searchResults);
    });
  }

  generatePassword();
  passwordLengthElement.value = length;

  // const currentPasswords = await getSavedPasswords();
  // const toggleSort = sortPasswordsByDateNew(currentPasswords);
  // console.log("toggleSort1:", toggleSort()[0].date);
  // console.log("toggleSort2:", toggleSort()[0].date);
};

init();

// Event Listeners
generateBtn.onclick = generatePassword;
copyBtn.addEventListener("click", () => {
  copyPassword();
  generateToast({
    message: COPIED_MESSAGE,
    backgroundColor: SUCCESS_MESSAGE_BACKGROUND_COLOR
  });
});
copyBtn.onclick = copyPassword;
saveBtn.onclick = savePassword;

passwordLengthElement.addEventListener("change", (event) => {
  length = event.target.value;
});

passwordLengthElement.addEventListener("input", (event) => {
  if (event.target.value.length > 2) {
    passwordLengthElement.value = event.target.value.slice(0, 2);
  }

  if (event.target.value > 16) {
    passwordLengthElement.value = 16;
  }

  generatePassword();
});

passwordUppercaseElement.addEventListener("change", (event) => {
  isUppercase = event.target.checked;
  if (isUppercase) {
    passwordLowercaseElement.setAttribute("disabled", true);
  } else {
    passwordLowercaseElement.removeAttribute("disabled");
  }
});

passwordLowercaseElement.addEventListener("change", (event) => {
  isLowercase = event.target.checked;
  if (isLowercase) {
    passwordUppercaseElement.setAttribute("disabled", true);
  } else {
    passwordUppercaseElement.removeAttribute("disabled");
  }
});

passwordSpecialCharsElement.addEventListener("change", (event) => {
  isNoSpecialChars = event.target.checked;
});

passwordNoNumbersElement.addEventListener("change", (event) => {
  isNoNumbers = event.target.checked;
});
