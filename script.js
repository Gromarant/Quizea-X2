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

const endpoint = "https://opentdb.com/api.php?amount=10&type=multiple";

fetch(endpoint)
  .then(response => response.json())
  .then(data => {
    let arrQuestions = data.results; /* array de preguntas */ 
    let questionIndex = 0;
    let totalQuestions = arrQuestions.length;

    printQuestion(arrQuestions[questionIndex]);

    const printNextQuestion = () => {
      if(questionIndex < totalQuestions) {
        questionIndex += 1
        if(questionIndex === totalQuestions) {
          document.querySelector('#next').innerHTML = 'Ver resultados';
          /*código para cambiar a la siguiente pantalla*/
        }
      } 
    }
    document.querySelector('#next').addEventListener('click', printNextQuestion);
  });
