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

function getAnswersReview(data) {
  let allquestionAnswers;
  if (allquestionAnswers.length < data.length) {
    allquestionAnswers = [question.correct_answer, ...questions.incorrect_answers];
  }
  return allquestionAnswers;
}

//Pinta en el DOM las preguntas y respuestas una a una
function printQuestion(object) {
  let answers = shuffled( getAnswersOneQuestion(object) );

  getElement('#quiz').innerHTML =
  `<section>
     <article>
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
     </label>
  </section>`

   //Asignación del evento a los label y radio buttons
   const labels = document.querySelectorAll('.formLabel');
   const radioButtons = document.querySelectorAll('.radio');
   setEventListenerOfClickEvent([...labels, ...radioButtons], handleSelectAnswer);
};

// //Pinta en el DOM las preguntas 
function printReview(object) {
  let gameData = [...object].map(gamePlayed => gamePlayed["games"].questions);
  let answers = getAnswersReview(gameData);

  getElement('#review').innerHTML +=
  `<section>
     <article>
     <p class="breadcrumbs">Question ${currentQuestionNumber}/${objectQuestion.length}</p>
     <p id="questionRev">${gameData.questions.question}</p>
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
     </label>
  </section>`
};

// //Pinta en el DOM las preguntas y respuestas una a una
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
  return selectedAnswers;
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
  
  for (let index=0; index<data.results.length; index++) {
    let question = data.results[index];

    let gamesPlayed = {
      playerId,
      nickName,
      games: [
        {
          gameDate: time.date,
          gameHour: time.hour,
          isSelectedTheCorrectAnswer: comparedAnswers[index],  /*-->Variable de si contestó correctamente*/
          questions: [
            question
          ],
        },
      ],
    }
    gamesPlayed.games.isSelectedTheCorrectAnswer = comparedAnswers[questionIndex];
    gamesPlayed.games.questions = question;
    gamesHistoryData.push(gamesPlayed);
  }
}


//---> Asigna el evento click a una colección
const setEventListenerOfClickEvent = (targetElementsArr, handlerFunction) => {
  targetElementsArr.forEach(element => {
    element.addEventListener('click', handlerFunction);
})};

//mostrar o escoder un elemento
const showElement = (elementToShow) => elementToShow.classList.remove('hidden');
const showElements = (elementsToShow) => elementsToShow.forEach(element => showElement(element));

const hideElement = (elementToHide) => elementToHide.classList.add('hidden');
const hideElements = (elementsToHide) => elementsToHide.forEach(element => hideElement(element));

//Quitar o agregar una clase a un elemento
const removeClass = (elementWhereRemove, elementClass) => elementWhereRemove.classList.remove(elementClass);
const addClass = (elementWhereAdd, newClass) => elementWhereAdd.classList.add(newClass);

//get collections of elements
const getElement = (selector) => document.querySelector(selector);
const getElements = (selectorArr) => selectorArr.map(selector => getElement(selector));

//Despliegado de las secciones de la app
function navigateToRegistration() {
  let elementsToHide = getElements(['#avatar', '#headerMenu', '#home', '#results', '#play', '#next', '#seeResults', '.navHamburgerMenu']);
  hideElements(elementsToHide);

  getElement('#signUp').addEventListener('click', navigateToHome);
  getElement('#logIn').addEventListener('click', navigateToHome);
}
navigateToRegistration() //inicialización del juego


function navigateToHome() {
  let elementsToHide = getElements(['#registration', '#quiz', '#results', '#review', '#logIn', '#next', '#seeResults', '#footerMenu','.navHamburgerMenu']);
  let elementsToShow = getElements(['#avatar', '#headerMenu', '#home', '#play']);
  hideElements(elementsToHide);
  showElements(elementsToShow);
  
  getElement('#logIn').innerHTML = 'Play';
  getElement('.saveNicknameBtn').addEventListener('click', () => {
    console.log('nickName:', getElement('#nickName').value);
    getElement('#nickName').value = '';
  });
  getElement('#play').addEventListener('click', navigateToQuiz);
}

function navigateToQuiz() {
  let elementsToHide = getElements(['#registration', '#home' , '#results', '#review', '#logIn', '#play', '#seeResults', '#footerMenu']);
  let elementsToShow = getElements(['#avatar', '#headerMenu', '#quiz', '#next']);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  printQuestion(data.results[0]);
  getElement('#next').addEventListener('click', printNextQuestion);
};

function navigateToResults() {
  questionIndex = 0;
  currentQuestionNumber = 1;
  let elementsToHide = getElements(['#registration', '#home', '#quiz', '#review', '#logIn', '#play', '#next', '#seeResults']);
  let elementsToShow = getElements(['#avatar', '#headerMenu', '#footerMenu', '#results']);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  setGameTime();
  getComparedAnswers();
  setGamesHistoryDataStructure();
  cleanLocalStorage();
  getElement('#navigateHomeBtn').addEventListener('click', navigateToHome);
  getElement('#navigateToQuizBtn').addEventListener('click', navigateToQuiz);
  getElement('#navigateReviewBtn').addEventListener('click', navigateToReview);
};

function navigateToReview() { 
  let elementsToHide = getElements(['#registration', '#home', '#quiz', '#results', '#logIn', '#play', '#next', '#seeResults']);
  let elementsToShow = getElements(['#avatar', '#headerMenu', '#footerMenu', '#review']);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  for (let i=0; i<gamesHistoryData.length; i++) {
    printReview(gamesHistoryData);
  };
};

const handleHamburguerMenu = () => getElement('.navHamburgerMenu').classList.toggle('hidden');


//Eventos
getElement('#avatar').addEventListener('click', navigateToHome);
getElement('.navigateToHomeBtn').addEventListener('click', navigateToHome);
getElement('.navigateToQuizBtn').addEventListener('click', navigateToQuiz);
getElement('.navigateToResultsBtn').addEventListener('click', navigateToResults);
getElement('.navigateToReviewBtn').addEventListener('click', navigateToReview);
getElement('#headerMenu').addEventListener('click', handleHamburguerMenu);