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