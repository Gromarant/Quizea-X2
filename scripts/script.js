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
let gameNumber = 1;
let users = [];

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

   //Asignación del evento a los label y radio buttons
   const labels = document.querySelectorAll('.formLabel');
   const radioButtons = document.querySelectorAll('.radio');
   setEventListenerOfClickEvent([...labels, ...radioButtons], handleSelectAnswer);
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

// //Modelo de datos para guardar las partidas
function setUsersCollectionStructure() {
  let time = storeDateTime();
  
  for (let index=0; index<data.results.length; index++) {
    let question = data.results[index];
    user.questions.push(question);
  }
  let user = ({
    userId: '',
    nickName,
    games: [
      {
        gameNumber,
        gameDate: time.date,
        gameHour: time.hour,
        questions: [],
      }
    ]
  })
  user.gameNumber = gameNumber;
  user.gameDate = time.date;
  user.gameHour = time.hour;
  user.push(gamesPlayed);
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
}
navigateToRegistration() //inicialización del juego


function navigateToHome() {
  let elementsToHide = getElements(['#registration', '#quiz', '#results', '#review', '#logIn', '#next', '#seeResults', '#footerMenu','.navHamburgerMenu']);
  let elementsToShow = getElements(['#avatar', '#headerMenu', '#home', '#play']);
  hideElements(elementsToHide);
  showElements(elementsToShow);
  
  getElement('.saveNicknameBtn').addEventListener('click', () => {
    console.log('nickName:', getElement('#nickName').value);
    /*---> Add NickName to firebase <--- */
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
  setUsersCollectionStructure();
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

  for (let i=0; i<users.length; i++) {
    printReview(users);
  };
};

const handleHamburguerMenu = () => getElement('.navHamburgerMenu').classList.toggle('hidden');

//-------------------------------------------------------------------------------------
//--> Carrusel <--
class Carousel {
  constructor(opts = {}) {
    this.bind();

    this.opts = {
      target: opts.target || "carousel",
    };

    // Select the carousel, its items, and the control buttons
    this.carousel = document.getElementById(this.opts.target);
    this.items = this.carousel.getElementsByClassName("item");
    this.prevBtn = document.getElementById("prev");
    this.nextBtn = document.getElementById("next");

    // Prepare to limit the direction in which the carousel can slide,
    // and to control how much the carousel slides on each interaction.
    // To slide the carousel by a single slide, we need to know the
    // carousel width, and the margin between each item.
    this.carouselWidth = this.carousel.offsetWidth;
    this.itemWidth = Math.round(
      this.items[1].getBoundingClientRect().left -
        this.items[0].getBoundingClientRect().left
    );
    this.itemMarginRight = Math.round(
      this.items[1].getBoundingClientRect().left -
        this.items[0].getBoundingClientRect().right
    );

    // Define x-axis offset properties to calculate the slide distance,
    // and a maximum width for an upper bound.
    // These offsets work with mouse or touch.
    this.offset = 0;
    this.touchOffset = 0;
    this.maxX = -(
      this.itemWidth * this.items.length -
      this.itemMarginRight -
      this.carouselWidth
    );

    // Start/end positions calculated when a user begins dragging slides,
    // during the drag, and at the end of dragging.
    // The threshold represents how much a user drags before advancing
    // the slide.
    this.posX1 = 0;
    this.posX2 = 0;
    this.posInitial = this.offset;
    this.posFinal = this.offset;
    this.threshold = 80;

    // Next/prev control button click events
    this.prevBtn.addEventListener("click", this.prev);
    this.nextBtn.addEventListener("click", this.next);

    // Mouse event for dragging slides
    this.carousel.addEventListener("mousedown", this.dragStart);

    // Touch events
    this.carousel.addEventListener("touchstart", this.dragStart);
    this.carousel.addEventListener("touchmove", this.dragAction, {
      passive: true,
    });
    this.carousel.addEventListener("touchend", this.dragEnd);
  }

  bind() {
    [
      "toggleControlDisplay",
      "prev",
      "next",
      "dragStart",
      "dragAction",
      "dragEnd",
    ].forEach((fn) => (this[fn] = this[fn].bind(this)));
  }

  toggleControlDisplay() {
    if (this.offset === 0) {
      this.prevBtn.style.display = "none";
    } else if (this.offset === this.maxX) {
      this.nextBtn.style.display = "none";
    } else {
      this.prevBtn.style.display = "block";
      this.nextBtn.style.display = "block";
    }
  }

  prev() {
    if (this.offset !== 0) {
      this.offset += this.itemWidth;
      this.carousel.style.transform = `translate3d(${this.offset}px, 0, 0)`;
      this.touchOffset = this.offset;
    }
    this.toggleControlDisplay();
  }

  next() {
    if (this.offset !== this.maxX) {
      this.offset -= this.itemWidth;
      this.carousel.style.transform = `translate3d(${this.offset}px, 0, 0)`;
      this.touchOffset = this.offset;
    }
    this.toggleControlDisplay();
  }

  dragStart(e) {
    e = e || window.event;
    e.preventDefault();

    this.posInitial = this.offset;

    if (e.type === "touchstart") {
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX1 = e.clientX;
      document.onmouseup = this.dragEnd;
      document.onmousemove = this.dragAction;
    }
  }

  dragAction(e) {
    e = e || window.event;

    if (e.type === "touchmove") {
      this.posX2 = this.posX1 - e.touches[0].clientX;
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - e.clientX;
      this.posX1 = e.clientX;
    }
    if (this.touchOffset >= 0 || this.touchOffset <= this.maxX) {
      this.touchOffset = this.offset;
    }

    this.touchOffset -= this.posX2;
    this.carousel.style.transform = `translate3d(${this.touchOffset}px, 0, 0)`;
  }

  dragEnd() {
    this.posFinal = this.touchOffset;
    if (this.posFinal - this.posInitial < -this.threshold) {
      this.next();
    } else if (this.posFinal - this.posInitial > this.threshold) {
      this.prev();
    } else {
      this.carousel.style.transform = `translate3d(${this.posInitial}px, 0, 0)`;
      this.touchOffset = this.offset;
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

new Carousel();

//Seleccionar una imagen e incluirla como imagen avatar del usuario;

function cambiarAvatar(nombreImagen) {
  var avatar = document.getElementById("avatarUser");
  avatar.style.backgroundImage =
    "url('assets/images/avatars/" + nombreImagen + "')";
  avatar.style.backgroundSize = "cover";
}

//-------------------------------------------------------------------------------------

// let carruselElements = getElements(["#avtr01.jpg", "#avtr02.jpg", "#avtr03.jpg", "#avtr04.jpg", "#avtr05.jpg", "#avtr_default.jpg"]);
// setEventListenerOfClickEvent(carruselElements, cambiarAvatar);

//Eventos
getElement('#avatarUser').addEventListener('click', navigateToHome);
getElement('.navigateToHomeBtn').addEventListener('click', navigateToHome);
getElement('.navigateToQuizBtn').addEventListener('click', navigateToQuiz);
getElement('.navigateToResultsBtn').addEventListener('click', navigateToResults);
getElement('.navigateToReviewBtn').addEventListener('click', navigateToReview);
getElement('#headerMenu').addEventListener('click', handleHamburguerMenu);