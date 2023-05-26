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
let comparedAnswers = [];
let dataTime = [];
let displayHomeBtns = [];
let displayQuizBtns = [];
let displayReviewBtns = [];

let playerId;
let nickName;

//Modelo de datos para guardar las partidas
let gamesHistoryData = [
  {
    playerId,
    nickName,
    games: [
      {
        gameDate: dataTime.date,
        gameHour: dataTime.hour,
        "isSelectedTheCorrectAnswer": comparedAnswers[questionIndex],  /*-->Variable de si contestó correctamente*/
        questions: [
          {
            ...respApi.results[questionIndex]
          },
        ],
      },
    ],
  },
];


// /*---> mezcla las preguntas y o las respuestas */
function shuffled(elements) {
  return elements.sort(() => Math.random() -0.5);
}

/*---> Une en un array las respuestas de una pregunta */
function getAnswersOneQuestion({correct_answer, incorrect_answers}) {
  let allAnswers;

  if (questionIndex < respApi.results.length) {
    allAnswers = [correct_answer, ...incorrect_answers];
    return allAnswers;
  }
}

//Pinta en el DOM las preguntas y respuestas una a una
function printQuestion(object) {
  let answers = shuffled( getAnswersOneQuestion(object) );

  document.getElementById('quiz').innerHTML =
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
};

//Pinta en el DOM las preguntas y respuestas una a una
const printNextQuestion = () => {

  if (questionIndex < respApi.results.length) {
    questionIndex++;
    currentQuestionNumber++;
    printQuestion(respApi.results[questionIndex])

    if(questionIndex === respApi.results.length) {
      document.querySelector('.nextElementBtn').innerHTML = 'Ver resultados';
      getPlayerAnswersFromLocalStorage()
      addClass(document.querySelector('#nextElementBtn'), 'navigateToResultsBtn')
    };
  };
};

//Función manejadora del evento click en label y radio button
function handleSelectAnswer(e) {
  let playerAnswer = e.target.value;

  //Asignación del evento a los label y radio buttons
  const labels = document.querySelectorAll('.formLabel');
  const radioButtons = document.querySelectorAll('.radio');
  setEventListenerOfClickEvent([...labels, ...radioButtons], handleSelectAnswer);

  if (!playerAnswer) {
    const checkedRadioButton = document.querySelector('.radio:checked');

    if (checkedRadioButton) {
      playerAnswer = checkedRadioButton.value;
    };
  };
  localStorage.setItem(`question${questionIndex}`, JSON.stringify(playerAnswer));
};

//---> Toma del localStorage las respuestas seleccionadas por los jugadores
function getPlayerAnswersFromLocalStorage() {

  for (let index=0; index<respApi.results.length; index++) {
    selectedAnswers.push(JSON.parse(localStorage.getItem(`question${index}`)));
  };
  return selectedAnswers
};

//---> obtiene las respuestas correctas y retorna un array
const getAllCorrectAnswer = () => {
  for (let i=0; i<respApi.results.length; i++) {
    allCorrectAnswers.push(respApi.results[i].correct_answer);
  }
  return allCorrectAnswers;
};


//---> Mostrar las secciones de main necesarias para cada pantalla
const gameSections = {
  home: {
    id: 'home',
  },
  quiz: {
    id: 'quiz',
  },
  results: {
    id: 'results',
  },
  review: {
    id: 'review',
  },
};


//verifica por Id la sección a mostrar
function displaySection(SectionId) {
  const sectionsOfPage = Object.values(gameSections)

  sectionsOfPage.forEach(sectionPage => {
    const section = document.getElementById(sectionPage.id);

    if (section.id === SectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    };
  });
};

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
