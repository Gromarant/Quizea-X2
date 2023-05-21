const endpoint = "https://opentdb.com/api.php?amount=10&type=multiple";
const preguntasDiv = document.getElementById("preguntas");

fetch(endpoint)
  .then(response => response.json())
  .then(data => {
    const preguntas = data.results;
    preguntas.forEach(pregunta => {//while o for para que muestre el index , no todas
      const preguntaHTML = `
        <article>
          <h3>${pregunta.question}</h3>
          <ul>
            ${pregunta.incorrect_answers.map(respuesta => `<li>${respuesta}</li>`).join("")}
            <li>${pregunta.correct_answer}</li>
          </ul>
        </article>
      `;
      preguntasDiv.innerHTML += preguntaHTML;
    });
  });