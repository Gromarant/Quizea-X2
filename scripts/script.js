// const dataBase = required '/scripts/dataBase.js';

//Llamada a la API
// async function getData() {
//   fetch("https://opentdb.com/api.php?amount=10&type=multiple")
//   let response = await response.json();
//   let data = await response;
//   return data;
// }

let data = {
  "response_code": 0,
  "results": [
    {
      "category": "Entertainment: Film",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Who directed &quot;E.T. the Extra-Terrestrial&quot; (1982)?",
      "correct_answer": "Steven Spielberg",
      "incorrect_answers": [
        "Stanley Kubrick",
        "James Cameron",
        "Tim Burton"
      ]
    },
    {
      "category": "Entertainment: Cartoon & Animations",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Which &#039;Family Guy&#039; character got his own spin-off show in 2009?",
      "correct_answer": "Cleveland Brown",
      "incorrect_answers": [
        "Glenn Quagmire",
        "Joe Swanson",
        "The Greased-up Deaf Guy"
      ]
    },
    {
      "category": "Geography",
      "type": "multiple",
      "difficulty": "easy",
      "question": "What state is the largest state of the United States of America?",
      "correct_answer": "Alaska",
      "incorrect_answers": [
        "California",
        "Texas",
        "Washington"
      ]
    },
  ],
};

// Inicialización de variables
let questionIndex = 0;
let currentQuestionNumber = 1;
let allCorrectAnswers = [];
let selectedAnswers = [];
let comparedAnswers = [];
let gamesHistoryData = [];


let playerId;
let nickName;

// /*---> mezcla las preguntas y o las respuestas */
function shuffled(elements) {
  return elements.sort(() => Math.random() -0.5);
}

/*---> Une en un array las respuestas de una pregunta */
function getAnswersOneQuestion(question) {
  let allquestionAnswers;

  if (questionIndex < data.results.length) {
    allquestionAnswers = [question.correct_answer, ...question.incorrect_answers];
  }
  return allquestionAnswers;
}

//Pinta en el DOM las preguntas y respuestas una a una
function printQuestion(object) {
  let answers = shuffled( getAnswersOneQuestion(object) );

  getElement('#quiz').innerHTML =
  `<article>
    <p class="breadcrumbs">Question ${currentQuestionNumber}/${data.results.length}</p>
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

   //Asignación del evento a los label y radio buttons
   const labels = document.querySelectorAll('.formLabel');
   const radioButtons = document.querySelectorAll('.radio');
   setEventListenerOfClickEvent([...labels, ...radioButtons], handleSelectAnswer);
};

//Pinta en el DOM las preguntas 
function printReview(object) {
  let [ gamesPlayed ] = object;
  let objectQuestion = gamesPlayed.games.collectionquestions
  let answers = getAnswersOneQuestion(objectQuestion);

  getElement('#review').innerHTML =
  `<article>
    <p class="breadcrumbs">Question ${currentQuestionNumber}/${data.results.length}</p>
    <p id="question">${objectQuestion.question}</p>
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
};

//Pinta en el DOM las preguntas y respuestas una a una
const printNextQuestion = () => {

  if (questionIndex < data.results.length) {
    questionIndex++;
    currentQuestionNumber++;
    printQuestion(data.results[questionIndex])

    if(questionIndex === data.results.length -1) {
      getPlayerAnswersFromLocalStorage();
      hideElement(getElement('#next'))
      showElement(getElement('#seeResults'));
      getElement('#seeResults').addEventListener('click', navigateToResults);
    };
  };
};

//Función manejadora del evento click en label y radio button
function handleSelectAnswer(e) {
  let playerAnswer = e.target.value;

  if (!playerAnswer) {
    const checkedRadioButton = document.querySelector('.radio:checked');
    if (checkedRadioButton) {
      playerAnswer = checkedRadioButton.value;
    };
  };
  localStorage.setItem(`question${questionIndex}`, JSON.stringify(playerAnswer));
};

//---> obtiene las respuestas correctas y retorna un array
const getAllCorrectAnswer = () => data.results.map(question => question.correct_answer);

//---> Toma del localStorage las respuestas seleccionadas por los jugadores
function getPlayerAnswersFromLocalStorage() {
  let selectedAnswers = [];

  for (let index=0; index<data.results.length; index++) {
    selectedAnswers.push(JSON.parse(localStorage.getItem(`question${index}`)));
  };
  return selectedAnswers
};

//Compara las respuestas correctas de cada pregunta con las respuestas
const getComparedAnswers = () => {
  let playerAnswer = getPlayerAnswersFromLocalStorage();
  let correctAnswers = getAllCorrectAnswer();
  return correctAnswers.map((answer, index) => answer === playerAnswer[index])
}

//---> clean localStorage
function cleanLocalStorage() {
  for (let index=0; index<data.results.length; index++) {
    localStorage.removeItem(`question${index}`);
  };
};

//Obtiene fecha y hora de la partida
function storeDateTime() {
  let now = new Date();
  let date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  let hour = `${now.getHours()}:${now.getMinutes()}`;

  return {date, hour};
}

function setGameTime() {
  let {date, hour} = storeDateTime();
  document.querySelector('.dataTime').innerHTML = `Game date: ${date}, Game Hour:${hour}`;
}

//Modelo de datos para guardar las partidas
function setGamesHistoryDataStructure() {
  let time = storeDateTime();
  let comparedAnswers = getComparedAnswers();
  let questions = data.results[questionIndex];

  let gamesPlayed = {
    playerId,
    nickName,
    games: [
      {
        gameDate: time.date,
        gameHour: time.hour,
        isSelectedTheCorrectAnswer: comparedAnswers[questionIndex],  /*-->Variable de si contestó correctamente*/
        collectionquestions: [
          questions
        ],
      },
    ],
  }
  gamesPlayed.games.isSelectedTheCorrectAnswer = comparedAnswers[questionIndex];
  gamesPlayed.games.collectionquestions = questions;
  gamesHistoryData.push(gamesPlayed);
}


//---> Asigna el evento click a una colección
const setEventListenerOfClickEvent = (targetElementsArr, handlerFunction) => {
  targetElementsArr.forEach(element => {
    element.addEventListener('click', handlerFunction);
})};

//mostrar o escoder un elemento
const showElement = (elementToShow) => elementToShow.classList.remove('hidden');
const hideElement = (elementToHide) => elementToHide.classList.add('hidden');

//Quitar o agregar una clase a un elemento
const removeClass = (elementWhereRemove, elementClass) => elementWhereRemove.classList.remove(elementClass);
const addClass = (elementWhereAdd, newClass) => elementWhereAdd.classList.add(newClass);


//obtiene la referencia a los botones que despliegan una sección
const getDisplayBtn = (buttonsCollection, classNameOfBtn) => buttonsCollection.push( document.querySelectorAll(classNameOfBtn) );

//Despliegado de las secciones de la app
function navigateToHome() {
  hideElement( document.querySelector('.nextElementBtn') );
  hideElement( document.querySelector('#score') );
  displaySection(gameSections.home);
  setEventListenerOfClickEvent(document.querySelectorAll('.navigateToQuizBtn'), navigateToQuiz);
}

function navigateToQuiz() {
  document.querySelector('#footerActionBtn').innerHTML = 'Siguiente';
  showElement( document.querySelector('#footerActionBtn') );
  // setEventListenerOfClickEvent(document.querySelectorAll('.formLabel'), handleSelectAnswer);
  displaySection(gameSections.quiz);
  printQuestion(respApi.results[questionIndex]);
};

function navigateToResults() {
  hideElement( document.querySelector('#footerActionBtn') );
  showElement( document.querySelector('.resultMenu') );
  displaySection(gameSections.results);
  storeDateTime();
  setComparedAnswers();
  setGamesHistoryDataStructure(); //se muestra la estructura de datos
};

function navigateReview() { //Agregar respuestas
  hideElement( document.querySelector('#footerActionBtn') );
  showElement( document.querySelector('.resultMenu') );

  displaySection(gameSections.review);
};


//Obtiene fecha y hora de la partida
function storeDateTime() {
  let now = new Date();
  let date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  let hour = `${now.getHours()}:${now.getMinutes()}`;

  dataTime.push(date, hour);
}


//Compara las respuestas correctas de cada pregunta con las respuestas
function setComparedAnswers() {

  for (let i = 0; i < allCorrectAnswers.length; i++) {
    comparedAnswers.push(allCorrectAnswers[i] === selectedAnswers[i]);
  };
};

//Eventos
//---> nextElementBtn agregar esta clase al pasar al quiz
document.querySelector('.navigateToQuizBtn').addEventListener('click', navigateToQuiz)
// setEventListenerOfClickEvent(document.querySelectorAll('.navigateToResultsBtn', navigateToResults));
// setEventListenerOfClickEvent(document.querySelectorAll('.navigateReviewBtn', navigateReview));
// document.querySelector('#footerActionBtn').addEventListener('click', printNextQuestion);
// document.querySelector('#quiz').addEventListener('click', handleSelectAnswer);
