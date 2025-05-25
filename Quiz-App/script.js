document.addEventListener("DOMContentLoaded", () => {

  let timer;
  let timeleft = 30; // or any value you want
  
  function startTimer() {
    timeleft = 30;
    document.getElementById("timer").textContent = `Time left: ${timeleft}s`;
    timer = setInterval(() => {
      timeleft--;
      document.getElementById("timer").textContent = `Time left: ${timeleft}s`;
  
      if (timeleft <= 0) {
        clearInterval(timer);
        if (answerSelected) return;
  
        answerSelected = true;
  
        const allOptions = optionsContainer.querySelectorAll(".option-box");
        const correctIndex = questions[currentQuestionIndex].answer;
  
        allOptions.forEach((option, index) => {
          if (index === correctIndex) {
            option.classList.add("correct");
            const optionResult = option.querySelector(".option-result");
            optionResult.innerHTML = "✓";
            optionResult.style.color = "var(--correct)";
          }
        });
  
        setTimeout(() => {
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
            loadQuestion();
          } else {
            showResult();
          }
        }, 1500);
      }
    }, 1000);
  }
  

  const welcomeScreen = document.getElementById("welcome-screen");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");

  // variables for quiz box
  const quizBox = document.getElementById("quiz-box");
  const questionCounter = document.getElementById("question-counter");
  const progressFill = document.getElementById("progress-fill");
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");

  const resultBox = document.getElementById("result-box");
  const finalScore = document.getElementById("final-score");
  const totalQuestions = document.getElementById("total-questions");
  const scorePercentage = document.getElementById("score-percentage");
  const scoreMessage = document.getElementById("score-message");
  const scoreCircleFill = document.getElementById("score-circle-fill");

  let currentQuestionIndex = 0;
  let score = 0;
  let quizstarted = false;
  let answerSelected = false;

  startBtn.addEventListener("click", startquiz);
  restartBtn.addEventListener("click", restartQuiz);

  totalQuestions.innerHTML = questions.length; // total number of questions

  function startquiz() {
    welcomeScreen.classList.add("hidden");
    quizBox.classList.remove("hidden");
    quizstarted = true;
    loadQuestion();
  }

  function restartQuiz() {
    resultBox.classList.add("hidden");
    quizBox.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
  }

  function loadQuestion() {
    answerSelected = false;
    const currentQuestion = questions[currentQuestionIndex];

    // Update question counter and progress bar
    questionCounter.innerHTML = `Question ${currentQuestionIndex + 1}/${
      questions.length
    }`;
    progressFill.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    // Set question text
    questionElement.innerHTML = currentQuestion.question;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Create option boxes
    currentQuestion.choices.forEach((choice, index) => {
      const optionBox = document.createElement("div");
      optionBox.className = "option-box";

      const optionContent = document.createElement("div");
      optionContent.className = "option-content";

      const optionMarker = document.createElement("div");
      optionMarker.className = "option-marker";
      optionMarker.innerHTML = String.fromCharCode(65 + index); // A, B, C, D

      const optiontext = document.createElement("span");
      optiontext.className = "option-text";
      optiontext.textContent = choice; // ← You also forgot this!

      optionContent.appendChild(optionMarker);
      optionContent.appendChild(optiontext);

      const optionResult = document.createElement("span");
      optionResult.className = "option-result";

      optionBox.appendChild(optionContent);
      optionBox.appendChild(optionResult);

      optionBox.addEventListener("click", () => {
        selectAnswer(index, optionBox, optionResult);
      });

      optionsContainer.appendChild(optionBox);
    });
    // Start timer for the question
    clearInterval(timer); // Clear any existing timer
    startTimer();

  }

  function selectAnswer(selectedIndex, optionBox, optionResult) {
    if (answerSelected) return;
    answerSelected = true;

    const correctIndex = questions[currentQuestionIndex].answer;

    if (selectedIndex === correctIndex) {
      optionBox.classList.add("correct");
      optionResult.innerHTML = "✓";
      optionResult.style.color = "var(--correct)";
      score++;
    } else {
      optionBox.classList.add("wrong");
      optionResult.innerHTML = "✗";
      optionResult.style.color = "var(--wrong)";

      // hightlight the correct answer if the user selects the wrong answer

      const allOptions = optionsContainer.querySelectorAll(".option-box");

      allOptions.forEach((option, index) => {
        if (index === correctIndex) {
          option.classList.add("correct");
          const optionResult = option.querySelector(".option-result");
          optionResult.innerHTML = "✓";
          optionResult.style.color = "var(--correct)";
        }
      });
    }
    // move to next question after second delay
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }, 1500);
  }

  function showResult() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");

    // Update score
    finalScore.textContent = score;

    // Calculate percentage
    const percentage = Math.round((score / questions.length) * 100);
    scorePercentage.textContent = `${percentage}%`;

    // Update circle fill
    const circumference = 2 * Math.PI * 54; // 2πr where r=54
    const offset = circumference - (circumference * percentage) / 100;
    scoreCircleFill.style.strokeDasharray = circumference;
    scoreCircleFill.style.strokeDashoffset = offset;

    // Set message based on score
    if (percentage >= 80) {
      scoreMessage.textContent = "Excellent!";
    } else if (percentage >= 60) {
      scoreMessage.textContent = "Good job!";
    } else if (percentage >= 40) {
      scoreMessage.textContent = "Not bad!";
    } else {
      scoreMessage.textContent = "Try again!";
    }
  }
});