document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const dueDate = document.getElementById("dueDate");
  const taskList = document.getElementById("taskList");
  const progress = document.getElementById("progress");
  const statsText = document.getElementById("statsText");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const themeToggle = document.getElementById("theme-toggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total ? (completed / total) * 100 : 0;
    progress.style.width = `${percentage}%`;
    statsText.textContent = `${completed} of ${total} tasks completed`;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    const filtered = tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchValue);
      const matchesFilter =
        filterValue === "all" ||
        (filterValue === "completed" && task.completed) ||
        (filterValue === "pending" && !task.completed);
      return matchesSearch && matchesFilter;
    });

    filtered.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task priority-${task.priority} ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
        <div class="info">
          <p>${task.text}</p>
          <small>${task.dueDate ? "Due: " + task.dueDate : ""}</small>
        </div>
        <div class="actions">
          <button onclick="toggleTask(${index})">✔</button>
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
    updateProgress();
  }

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    const date = dueDate.value;
    if (!text) return;

    tasks.push({ text, priority, dueDate: date, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
  });

  window.toggleTask = index => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  window.deleteTask = index => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  window.editTask = index => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText) tasks[index].text = newText;
    saveTasks();
    renderTasks();
  };

  searchInput.addEventListener("input", renderTasks);
  filterSelect.addEventListener("change", renderTasks);

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  });

  renderTasks();
});
