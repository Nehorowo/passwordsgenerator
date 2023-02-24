export const createLoader = () => {
  const loaderOverlay = document.createElement("div");
  const loaderElement = document.createElement("div");
  loaderOverlay.classList.add("loaderOverlay");
  loaderElement.classList.add("loader");

  return {
    show() {
      document.body.appendChild(loaderOverlay);
      document.body.appendChild(loaderElement);
    },
    hide() {
      loaderOverlay.remove();
      loaderElement.remove();
    }
  };
};
