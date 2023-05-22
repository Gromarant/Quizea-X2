//Boceto de cómo mostra un solo índex a la vez y aviso final
let myData = ["amarillo", "rojo", "azul", "verde", "naranja", "violeta", "cyan", "magenta"];
let index = 0;
let muestra_01 = document.querySelector(".muestra_01");
let muestra_02 = document.querySelector(".muestra_02");
muestra_01.innerHTML = myData[index];

document.querySelector("#siguiente").addEventListener("click", function() {
    if (index < myData.length - 1) {
        index++;
        muestra_01.innerHTML = myData[index];
    } else {
        muestra_02.innerHTML = "Has llegado al final";
        muestra_01.innerHTML = "";
    }
});

//Boceto de como recoger y mostrar fecha, hora y Partida:

let data = [];//las 3 variables siguientes hacen referencia a elementos del html
  let myButton = document.getElementById("myButton");
  let showData = document.getElementById("showData");
  let article = document.querySelector(".showData");

  myButton.addEventListener("click", storeDateTime);
  showData.addEventListener("click", displayData);

  function storeDateTime() {
    let now = new Date();
    let date = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    data.push({ date, month, year, hours, minutes, seconds });
    console.log("Partida: " + data.length);
    console.log("Fecha: " + date + "/" + month + "/" + year);
    console.log("Hora: " + hours + ":" + minutes + ":" + seconds);
  }

  function displayData() {
    article.innerHTML = "";
    data.forEach((item) => {

      const p1 = document.createElement("p");
      p3.textContent = `Partida: ${data.indexOf(item) + 1}`;

      const p2 = document.createElement("p");
      p1.textContent = `Fecha: ${item.date}/${item.month}/${item.year}`;

      const p3 = document.createElement("p");
      p2.textContent = `Hora: ${item.hours}:${item.minutes}:${item.seconds}`;

      article.appendChild(p1);
      article.appendChild(p2);
      article.appendChild(p3);
    });
  }