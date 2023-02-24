import { appElement } from "../utils";

let toastContainer;

export const generateToast = ({
  message,
  backgroundColor = "#4682B4",
  color = "#fffffe",
  length = "2000ms"
}) => {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='toast'
      style="background-color: ${backgroundColor};
      color: ${color};
      animation-duration: ${length}">
      ${message}
      </p>`
  );
  const toast = document.querySelector(".toast");
  toast.addEventListener("animationEnd", () => toast.remove());
};

(() => {
  appElement.insertAdjacentHTML(
    "afterbegin",
    `<div class='toastContainer'></div>`
  );
  toastContainer = document.querySelector(".toastContainer");
})();
