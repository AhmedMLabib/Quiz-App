let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsDiv = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      // create bullets and set set question counts
      createBullets(questionsCount);
      // add data function
      addQuestionData(questionsObject[currentIndex], questionsCount);
      countdown(15, questionsCount);
      // click on submit
      submitButton.onclick = () => {
        // get right answer
        let rightAnswer = questionsObject[currentIndex]["right_answer"];
        // increase index
        currentIndex++;
        // check the answer
        checkAnswer(rightAnswer, questionsCount);
        // remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);
        // handle bullets class
        handleBullets();
        clearInterval(countdownInterval);
        countdown(15, questionsCount);
        // show results
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "json/questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  // add questions count to the span
  countSpan.innerHTML = num;
  // create bullets spans
  for (let i = 0; i < num; i++) {
    // create span
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    //  append bullet to bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");
    // create question text
    let questionText = document.createTextNode(obj["title"]);
    // append text to quiz h2
    questionTitle.appendChild(questionText);
    // append h2 to quiz area
    quizArea.appendChild(questionTitle);
    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create Main Answer Div
      let mainDiv = document.createElement("div");
      // add class to mainDiv
      mainDiv.className = "answer";
      // create radio input
      let radioInput = document.createElement("input");
      // add type + name + id + data attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // create label
      let theLabel = document.createElement("label");
      // add for to label
      theLabel.htmlFor = `answer_${i}`;
      // create label text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      // add text to the label
      theLabel.appendChild(theLabelText);
      // add radio to main div
      mainDiv.appendChild(radioInput);
      // add input to main div
      mainDiv.appendChild(theLabel);
      // add main div to answers div
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class='good'>Good</span> , ${rightAnswers} / ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class='perfect'>Perfect</span> , ${rightAnswers} / ${count}`;
    } else {
      theResults = `<span class='bad'>Bad</span> , ${rightAnswers} / ${count}`;
    }
    resultsDiv.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
