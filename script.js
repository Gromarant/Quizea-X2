//Llamada a la API
// const endpoint = "https://opentdb.com/api.php?amount=10&type=multiple";

// let questionsArr;
// fetch(endpoint)
//   .then(response => response.json())
//   .then(data => {
//     questionsArr = data.results /* array de preguntas */ 
//   })
// console.log(questionsArr)
// console.log(apiRequest());


//Modelo de respuesta de la API
let respApi = {
  "response_code": 0,
  "results": [
    {
      "category": "Entertainment: Books",
      "type": "multiple",
      "difficulty": "easy",
      "question": "George Orwell wrote this book, which is often considered a statement on government oversight.",
      "correct_answer": "1984",
      "incorrect_answers": [
        "The Old Man and the Sea",
        "Catcher and the Rye",
        "To Kill a Mockingbird"
      ]
    },
    {
      "category": "General Knowledge",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Virgin Trains, Virgin Atlantic and Virgin Racing, are all companies owned by which famous entrepreneur?   ",
      "correct_answer": "Richard Branson",
      "incorrect_answers": [
        "Alan Sugar",
        "Donald Trump",
        "Bill Gates"
      ]
    },
    {
      "category": "Science & Nature",
      "type": "multiple",
      "difficulty": "medium",
      "question": "The humerus, paired radius, and ulna come together to form what joint?",
      "correct_answer": "Elbow",
      "incorrect_answers": [
        "Knee",
        "Sholder",
        "Ankle"
      ]
    },
  ]
};                  

//Inicialización de variables
let questionIndex = 0;
let currentQuestionNumber = 1;
let allCorrectAnswers = [];
let selectedAnswers = [];
let gamesHistoryData = []; /* Se puede agregar a este elemento la propiedad 'date', con el valor de la fecha de jugada para que funcione como un id y guardar los*/

//variables que rellenar para darle valor las propiedades de la coleccion ---> gamesHistoryData <---
//las he inicializado para que no de ERROR EN LA CONSOLA
let playerId; 
let gameDate;
let gameHour;
let isCorrectAnswerSelected;

//Modelo de datos para guardar las partidas
gamesHistoryData = 
{ 
  id: playerId,     
  games: [ //--> hictórico de partidas jugadas
    { 
      date: gameDate, //--> fecha de la jugada
      hour: gameHour, //--> hora de la jugada
      questions: [
        {
        "isSelectTheCorrectAnswer": isCorrectAnswerSelected,  /*-->Variable de si contestó correctamente*/
        "category": "Entertainment: Books",
        "type": "multiple",
        "difficulty": "easy",
        "question": "George Orwell wrote this book, which is often considered a statement on government oversight.",
        "correct_answer": "1984",
        "incorrect_answers": ["The Old Man and the Sea", "Catcher and the Rye", "To Kill a Mockingbird" ]
      }, 
      {
        "userGivenAnswer": isCorrectAnswerSelected,  /*-->Variable de si contestó correctamente*/
        "category": "Entertainment: Books",
        "type": "multiple",
        "difficulty": "easy",
        "question": "George Orwell wrote this book, which is often considered a statement on government oversight.",
        "correct_answer": "1984",
        "incorrect_answers": ["The Old Man and the Sea", "Catcher and the Rye", "To Kill a Mockingbird" ]
      }, 
    ] 
    }
  ]
}

//Pinta la primera pregunta
printQuestion(respApi.results[questionIndex]);

// /*---> mezcla las preguntas y o las respuestas */
function shuffled(elements) {   
  return elements.sort(() => Math.random() -0.5);
}

/*---> Une en un array las respuestas de una pregunta */
function getAnswersOneQuestion({correct_answer, incorrect_answers}) {
  let allanswers;

  if (questionIndex < respApi.results.length) {
    allanswers = [correct_answer, ...incorrect_answers];
    return allanswers;
  }
}

//Pinta en el DOM las preguntas y respuestas una a una
function printQuestion(object) {
  let answers = getAnswersOneQuestion(object);

  if (respApi.results) {
    shuffled(answers); /*obtiene y sortea las respuestas*/
  }

  document.getElementById('question').innerHTML = 
  `<article>
    <p class="breadcrumbs">Question ${currentQuestionNumber}/${object.length}</p>
    <p id="question">${object.question}</p>
  </article>
  <label class="formLabel" for="answer1">${answers[0]}
    <input type="radio" class="radio" name="answer" id="answer1" value="${answers[0]}">
  </label>
  <label class="formLabel" for="answer2">${answers[1]}
    <input type="radio" class="radio" name="answer" id="answer2" value="${answers[1]}">
  </label>
  <label class="formLabel" for="answer3">${answers[2]}
    <input type="radio" class="radio" name="answer" id="answer3" value="${answers[2]}">
  </label>
  <label class="formLabel" for="answer4">${answers[3]}
    <input type="radio" class="radio" name="answer" id="answer4" value="${answers[3]}">
  </label>`

}
document.querySelector('.formLabel').addEventListener('click', handleSelectAnswer)

//Pinta en el DOM las preguntas y respuestas una a una
const printNextQuestion = () => {
  
  if (questionIndex < respApi.results.length) {
    questionIndex++; 
    currentQuestionNumber++;
    printQuestion(respApi.results[questionIndex]) 

    if(questionIndex === respApi.results.length) {
      document.querySelector('.nextElementBtn').innerHTML = 'Ver resultados';
      getPlayerAnswersFromLocalStorage()
      /*código para cambiar a la siguiente pantalla*/
    }
  } 
}

//Asigna el evento handleSelectAnswer a los elementos del array
const setHandleSelectAnswerTargets = (targetElements) => {
  targetElements.forEach(element => {
    element.addEventListener('click', handleSelectAnswer)
})};

//Función manejadora del evento click en label y radio button
function handleSelectAnswer(e) {
  let playerAnswer = e.target.value;

  //Asignación del evento a los label y radio buttons
  const labels = document.querySelectorAll('.formLabel');
  const radioButtons = document.querySelectorAll('.radio');
  setHandleSelectAnswerTargets([...labels, ...radioButtons])

  if (!playerAnswer) {
    const checkedRadioButton = document.querySelector('.radio:checked');

    if (checkedRadioButton) {
      playerAnswer = checkedRadioButton.value;
    }
  }
  localStorage.setItem(`question${questionIndex}`, JSON.stringify(playerAnswer));
}

//Toma del localStorage las respuestas seleccionadas por los jugadores
function getPlayerAnswersFromLocalStorage() {

  for (let index=0; index<respApi.results.length; index++) {
    selectedAnswers.push(JSON.parse(localStorage.getItem(`question${index}`)));
  }
  return selectedAnswers
}

//obtiene las respuestas correctas y retorna un array
const getAllCorrectAnswer = () => {
  for (let i=0; i<respApi.results.length; i++) {
    allCorrectAnswers.push(respApi.results[i].correct_answer);
  }
  return allCorrectAnswers;
}

//Función para mostrar un elemento escondido
const showElement = (elementToShow) => {
  elementToShow.classList.remove('hidden');
}

//Función para esconder un elemento
const hideElement = (elementToHide) => {
  elementToHide.classList.add('hidden');
}

//Eventos
document.querySelector('#next').addEventListener('click', printNextQuestion);
document.querySelector('#question').addEventListener('click', handleSelectAnswer);