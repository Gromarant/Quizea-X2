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

// const endpoint = "https://opentdb.com/api.php?amount=10&type=multiple";

// let questionsArr;

// const apiRequest = () => {
//   fetch(endpoint)
//     .then(response => response.json())
//     .then(data => {
//       questionsArr = data.results /* array de preguntas */ 
//     })
// }

let questionIndex = 0;

printQuestion(respApi.results[questionIndex]);
const printNextQuestion = () => {
  if(questionIndex < totalQuestions) {
    questionIndex += 1
    if(respApi.results.length === totalQuestions) {
      document.querySelector('#next').innerHTML = 'Ver resultados';
      /*código para cambiar a la siguiente pantalla*/
    }
  } 
}
document.querySelector('#next').addEventListener('click', printNextQuestion);

function printQuestion(object) {
  let answers = shuffled( getAnswersOneQuestion(object) ); //obtiene y sortea las respuestas

  document.getElementById('question').innerHTML = 
  `<article>
      <p class="breadcrumbs">Question 1/${respApi.results.length}</p>
      <p id="question">${object.question}</p>
    </article>
    <input type="text" name="answer" id="answer1" value="${answers[0]}">
    <input type="text" name="answer" id="answer2" value="${answers[1]}">
    <input type="text" name="answer" id="answer3" value="${answers[2]}">
    <input type="text" name="answer" id="answer4" value="${answers[3]}">`
}

function shuffled(elements) {   /*---> mezcla las preguntas y o las respuestas */
  return elements.sort(() => Math.random() -0.5);
}

function getAnswersOneQuestion({correct_answer, incorrect_answers}) { /*---> busca las respuestas correcta */
  let allanswers = [correct_answer, ...incorrect_answers];
  return allanswers;
}