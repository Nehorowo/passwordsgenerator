import { serializeForm } from "./utils";

document.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = serializeForm(event.target);
  console.log(data);

  fetch("https://j7rrbn.deta.dev/register", {
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
      } else if (data) {
        console.log(`data: ${JSON.stringify(data)}`);
        document.getElementById("formErrorText").textContent =
          "Успешно зарегистрирован!";
        event.target.reset();
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 2000);
      }
    });
});
