document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput"); // Input field for new tasks
  const addBtn = document.getElementById("addBtn"); // Button to add a new task
  const todoList = document.getElementById("todoList"); // Container for the task list
  const filterBtns = document.querySelectorAll(".filter-btn"); // Buttons to filter tasks

  let tasks = []; // Array to store tasks
  let currentFilter = "all"; // Current filter ('all', 'active', 'completed')

  function addTask() {
    const tasktext = taskInput.value.trim(); // Get and trim the input value
    if (tasktext === "") return; // Do nothing if input is empty

    const task = {
      id: Date.now(), // Unique ID based on timestamp
      text: tasktext, // Task description
      completed: false, // Task is initially not completed
    };

    tasks.push(task); // Add the new task to the task list
    taskInput.value = ""; // Clear the input field
    renderTasks(); // Update the task list display
  }

  function renderTasks() {
    const filteredTasks = filtertasks(); // Get tasks based on the current filter
    // If no tasks match the filter, show an empty state message
    if (filteredTasks.length === 0) {
      todoList.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <p>${
                  currentFilter === "all"
                    ? "Your task list is empty"
                    : currentFilter === "active"
                    ? "No active tasks"
                    : "No completed tasks"
                }</p>
            </div>
        `;
      return;
    }

    todoList.innerHTML = "";
    filteredTasks.forEach(task => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("todo-item"); // Add a class for styling
      if (task.completed) {
        taskElement.classList.add("completed"); // Add 'completed' class if task is done
      }

      // Task HTML structure
      taskElement.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="todo-text">${task.text}</span>
      <button class="delete-btn">×</button>
  `
      // Add event listener to toggle task completion
      // Add event listener to toggle task completion
      const checkbox = taskElement.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
          toggleTaskStatus(task.id);
      });
      const deleteBtn = taskElement.querySelector(".delete-btn"); //    Select the delete button
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id); // Remove the task from the list
        renderTasks(); // Re-render the task list
        deleteTask(task.id); // Call the delete function
      });

      todoList.appendChild(taskElement); // Append the task element to the list
    });
  }

  function filtertasks() {
    switch (currentFilter) {
      case "all":
        return tasks; // Return all tasks
      case "active":
        return tasks.filter((task) => !task.completed); // Return only active tasks
      case "completed":
        return tasks.filter((task) => task.completed); // Return only completed tasks
    }
  }

    // Function to toggle the completion status of a task
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed }; // Toggle the 'completed' property
            }
            return task; // Return unchanged task
        });
        renderTasks(); // Update the task list displayf
    };

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id); // Remove the task from the list
    // deleteTask(tasks.id); // Call the delete function
    renderTasks(); // Re-render the task list
  }

  addBtn.addEventListener("click", addTask); // Add event listener to the button

  // Event listener for pressing 'Enter' in the input field
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active")); // Remove 'active' class from all buttons
      btn.classList.add("active"); // Add 'active' class to the clicked button
      currentFilter = btn.getAttribute("data-filter"); // Update the current filter
      renderTasks(); // Update the task list display
    });
  });



  renderTasks(); // Initial render of tasks
});
