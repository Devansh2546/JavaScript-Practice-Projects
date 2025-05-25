const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".goal-input");
const errorLabel = document.querySelector(".error-label");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const progresslabel = document.querySelector(".progress-label")

const allquotes = [
    'Raise the bar by compeleting your goals!',
    'Well begun is half done!',
    'Just a step away , keep gonig!',
    'Whoa! You just compeleted all the goals ,time to chill now'
]

const allGoals = JSON.parse(localStorage.getItem("allGoals") || "{}");
let completedGoalscount = Object.values(allGoals).filter(
  (goals) => goals.completed
).length;
progresslabel.innerText = allquotes[completedGoalscount]
progressValue.style.width = `${(completedGoalscount / 3) * 100}%`;
progressValue.firstElementChild.innerText = `${completedGoalscount}/3 compeleted`;

checkBoxList.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    // console.log("checkbox clicked");

    // Check if all input fields are filled
    const allFieldFilled = [...inputFields].every(
      (input) => input.value.trim() !== ""
    );
    // console.log(allFieldFilled);

    if (allFieldFilled) {
      checkbox.parentElement.classList.toggle("completed");

      // Fix: Correctly update progress bar width
      //   progressValue.style.width = "33.33%";

      // Fix: Get correct input ID
      const inputID = checkbox.nextElementSibling.id;
      //   console.log(inputID);

      // Fix: Ensure allGoals[inputID] exists
      if (!allGoals[inputID]) {
        allGoals[inputID] = { name: "", completed: false };
      }

      // Fix: Correct spelling mistake
      allGoals[inputID].completed = !allGoals[inputID].completed;

      completedGoalscount = Object.values(allGoals).filter(
        (goals) => goals.completed
      ).length;
      progressValue.style.width = `${(completedGoalscount / 3) * 100}%`;
      progressValue.firstElementChild.innerText = `${completedGoalscount}/3 compeleted`;
      progresslabel.innerText = allquotes[completedGoalscount]
  
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    } else {
      progressBar.classList.add("show-error");
    }
  });
});

inputFields.forEach((input) => {
  //   console.log(allGoals[input.id]);

  // Fix: Ensure allGoals[input.id] exists before accessing `.name`
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].name;
    if (allGoals[input.id].completed) {
      input.parentElement.classList.add("completed");
    }
  } else {
    // Initialize if input ID is missing in allGoals
    allGoals[input.id] = { name: "", completed: false };
  }

  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", (e) => {
    if(allGoals[input.id].completed){
        input.value = allGoals[input.id].name
        return
    }
    allGoals[input.id].name = input.value
    console.log(input);
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });
});
