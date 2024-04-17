
const form = document.getElementById("restoreForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/restore", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      alert("Contraseña reestablecida con exito");
      window.location.replace("/login");
    } else {
      alert("Algo salio mal");
    }
  });
});