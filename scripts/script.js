// Llamada a la API
async function getData() {
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
  let response = await response.json();
  let data = await response;
  return data;
}
let data = await getData(); 

// Inicialización de variables
let questionIndex = 0;
let currentQuestionNumber = 1;
let allCorrectAnswers = [];
let selectedAnswers = [];
let comparedAnswers = [];
let currentGameNumber = 1;
let gamesPlayed = [];

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

const questionStructure = (props) => {
  return `<section id="${props.id}">
            <article>
            <p class="breadcrumbs">Question ${props.questionNum}/${props.totalQuestions.length}</p>
            <p id="${props.idQuestion}">${props.question}</p>
            </article>
            <label class="formLabel" for="answer1">${props.answers[0]}
              <input type="radio" class="radio" name="answer" id="answer1" value="${props.answers[0]}">
            </label>
            <label class="formLabel" for="answer2">${props.answers[1]}
              <input type="radio" class="radio" name="answer" id="answer2" value="${props.answers[1]}">
            </label>
            <label class="formLabel" for="answer3">${props.answers[2]}
              <input type="radio" class="radio" name="answer" id="answer3" value="${props.answers[2]}">
            </label>
            <label class="formLabel" for="answer4">${props.answers[3]}
              <input type="radio" class="radio" name="answer" id="answer4" value="${props.answers[3]}">
            </label>
          </section>`
}


//Pinta en el DOM las preguntas y respuestas una a una
function printQuestion(object) {
  let answers = shuffled( getAnswersOneQuestion(object) );

  getElement('#quiz').innerHTML =
  `<section id="quizQuestion">
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
}

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

const setResultHeader = () => {
  const score = getComparedAnswers()
               .filter(question => question === true).length;
               console.log('score', score);
               console.log(data.results.length);
  getElement('.scoreCard').src = `assets/images/scoreCards/${score}10.svg`;
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

// Guardar selecciones del usuario
const answerOfQuestion = (object) => {

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


//Actualizar nickName
const updateNickName = (e) => {
  e.preventDefault();

  let shortName = getElement('#nickName').value;

  if (shortName) {
    hideElement('#nickName').classList.add('unvisible');
    shortName = '';
    getElement('.saveNicknameBtn').innerHTML = update;
  }
}


//Despliegado de las secciones de la app
function navigateToRegistration() {
  let elementsToHide = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#home', 
    '#results', 
    '#play', 
    '#next', 
    '#seeResults', 
    '.navHamburgerMenu'
  ]);
  hideElements(elementsToHide);
}
navigateToRegistration() //inicialización del juego


function navigateToHome() {
  let elementsToHide = getElements([
    '#registration', 
    '#quiz', 
    '#results', 
    '#review'
    , '#logIn', 
    '#next', 
    '#seeResults', 
    '#footerMenu',
    '.navHamburgerMenu'
  ]);
  let elementsToShow = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#home', 
    '#play'
  ]);
  hideElements(elementsToHide);
  showElements(elementsToShow);
}

function navigateToQuiz() {
  let elementsToHide = getElements([
    '#registration', 
    '#home' ,
     '#results', 
     '#review', 
     '#logIn', 
     '#play', 
     '#seeResults', 
     '#footerMenu'
  ]);
  let elementsToShow = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#quiz', 
    '#next'
  ]);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  printQuestion(data.results[0]);
  getElement('#next').addEventListener('click', printNextQuestion);
};

function navigateToResults() {
  setResultHeader();
  questionIndex = 0;
  currentQuestionNumber = 1;
  let elementsToHide = getElements([
    '#registration', 
    '#home', 
    '#quiz', 
    '#review', 
    '#logIn', 
    '#play', 
    '#next', 
    '#seeResults'
  ]);
  let elementsToShow = getElements([
    '#avatarUser', 
    '#headerMenu', 
    '#footerMenu', 
    '#results'
  ]);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  setGameTime();
  getComparedAnswers();
  cleanLocalStorage();

  getElement('#navigateHomeBtn').addEventListener('click', navigateToHome);
  getElement('#navigateToQuizBtn').addEventListener('click', navigateToQuiz);
  getElement('#navigateReviewBtn').addEventListener('click', navigateToReview);
};

function navigateToReview() { 
  let elementsToHide = getElements(['#registration', '#home', '#quiz', '#results', '#logIn', '#play', '#next', '#seeResults']);
  let elementsToShow = getElements(['#avatarUser', '#headerMenu', '#footerMenu', '#review']);
  hideElements(elementsToHide);
  showElements(elementsToShow);

  for (let i=0; i<users.length; i++) {
    printReview(users);
  };
};

const handleHamburguerMenu = () => getElement('.navHamburgerMenu').classList.toggle('hidden');

//Partimos de estos datos que son inventados
let games = {
  game01: {
     date: "2022-05-23",
     hour: "20:32",
     correctAnswersCounter: 2
   },
   game02: {
     date: "2022-05-24",
     hour: "10:15",
     correctAnswersCounter: 8
   },
   game03: {
     date: "2022-05-25",
     hour: "18:45",
     correctAnswersCounter: 10
   }
 };

 
 //Pintando la gráfica

 let canvasElement = document.getElementById("scoring");

 let datehour = [];
for (let game in games) {
  let date = games[game].date;
  let hour = games[game].hour;
  datehour.push(` ${date} | ${hour}.`);
}
datehour.reverse();

let scores = [];
for (let game in games) {
  let score = games[game].correctAnswersCounter;
  scores.push(score);
}
scores.reverse();

let config = {
  type: "bar",
  data: {
      labels: datehour, 
      datasets: [{
          label: "Y's: score; X's: day|hour", 
          data:scores,
          backgroundColor: [
              "rgba(255,166,66,0.2)",//Orange
              "rgba(255,96,136,0.2)",//Red
              "rgba(56,166,236,0.2)",//Blue
              "rgba(76,196,196,0.2)",//Green
              "rgba(156,106,255,0.2)",//Purple
          ],
          borderColor: [
              "rgba(255,166,66,1)",//Orange
              "rgba(255,96,136,1)",//Red
              "rgba(56,166,236,1)",//Blue
              "rgba(76,196,196,1)",//Green
              "rgba(156,106,255,1)",//Purple
          ],
          borderWidth:1,
      }]
 },
 options: {
  scales: {
    yAxes: [{
      display: true,
      ticks: {
          beginAtZero: true
      }  
    }]
  }
}
};

 let scoring = new Chart(canvasElement, config)

getElement('.saveNicknameBtn').addEventListener('click', updateNickName);
getElement('#avatarUser').addEventListener('click', navigateToHome);
getElement('.navigateToHomeBtn').addEventListener('click', navigateToHome);
getElement('.navigateToQuizBtn').addEventListener('click', navigateToQuiz);
getElement('.navigateToResultsBtn').addEventListener('click', navigateToResults);
getElement('.navigateToReviewBtn').addEventListener('click', navigateToReview);
getElement('#headerMenu').addEventListener('click', handleHamburguerMenu);