import { appElement } from "../utils";

export const guard = async ({
  title,
  submitButtonText = "Удалить",
  cancelButtonText = "Отменить"
}) => {
  appElement.insertAdjacentHTML(
    "afterbegin",
    `<div class='guardContainer'></div>`
  );
  const guardContainer = document.querySelector(".guardContainer");

  guardContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class='guardOverlay'></div><div class='guardContent'>
      <h3>${title}</h3>
      <div class="guardButtons">
        <button class="guardButton" id="guardButtonCancel">${cancelButtonText}</button>
        <button class="guardButton" id="guardButtonSubmit">${submitButtonText}</button>
      </div>
    </div>`
  );

  const result = await new Promise((resolve) => {
    document
      .getElementById("guardButtonCancel")
      .addEventListener("click", () => {
        guardContainer.remove();
        resolve(false);
      });

    document
      .getElementById("guardButtonSubmit")
      .addEventListener("click", () => {
        guardContainer.remove();
        resolve(true);
      });
  });

  return result;
};
