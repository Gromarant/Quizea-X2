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
