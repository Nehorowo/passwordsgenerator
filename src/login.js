import { serializeForm } from "./utils";

document.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = serializeForm(event.target);

  fetch("https://j7rrbn.deta.dev/login", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.error) {
        console.log(`error: ${data?.error}`);
        document.getElementById("formErrorText").textContent =
          "Неверный логин или пароль";
        event.target.reset();
      } else if (data?.token && data?.refreshToken) {
        // console.log(`token: ${data?.token}`);
        localStorage.setItem("token", data?.token);
        localStorage.setItem("refreshToken", data?.refreshToken);
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 2000);
      }
    });
});
