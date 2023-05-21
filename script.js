//Mezclar respuestas
let correct_answer = ["Lake Superior "];
let incorrect_answers = ["Caspian Sea","Lake Michigan","Lake Huron"];
let allAnswers = [...correct_answer, ...incorrect_answers];

function shuffledA(answers) {
  return answers.sort(() => Math.random() - 0.5);
}
shuffledA(allAnswers);

console.log(shuffledA(allAnswers));