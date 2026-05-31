let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const itemCount = document.querySelector("#itemCount");
const footer = document.querySelector("#footer");
const clearCompleted = document.querySelector("#clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateFooter() {
  const activeCount = todos.filter((t) => !t.completed).length;
  itemCount.textContent = activeCount + " items left";
  footer.classList.toggle("hidden", todos.length === 0);
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  li.dataset.id = todo.id;
  if (todo.completed) li.classList.add("completed");

  if (currentFilter === "active" && todo.completed) li.classList.add("hidden");
  if (currentFilter === "completed" && !todo.completed) li.classList.add("hidden");

  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = todo.text;
  span.dataset.action = "toggle";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "❌";
  deleteBtn.dataset.action = "delete";

  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

function render() {
  todoList.innerHTML = "";
  todos.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
  updateFooter();
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const todo = { id: Date.now().toString(), text, completed: false };
  todos.push(todo);
  save();

  todoList.appendChild(createTodoElement(todo));
  updateFooter();

  todoInput.value = "";
  todoInput.focus();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  todoList.querySelector("[data-id='" + id + "']").remove();
  updateFooter();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  save();

  const li = todoList.querySelector("[data-id='" + id + "']");
  li.classList.toggle("completed", todo.completed);
  if (currentFilter === "active" && todo.completed) li.classList.add("hidden");
  if (currentFilter === "completed" && !todo.completed) li.classList.add("hidden");
  updateFooter();
}

function startEdit(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const li = todoList.querySelector("[data-id='" + id + "']");
  const span = li.querySelector(".todo-text");

  const input = document.createElement("input");
  input.classList.add("edit-input");
  input.value = todo.text;
  span.replaceWith(input);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText) todo.text = newText;
    save();
    const newSpan = document.createElement("span");
    newSpan.classList.add("todo-text");
    newSpan.textContent = todo.text;
    newSpan.dataset.action = "toggle";
    input.replaceWith(newSpan);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      const newSpan = document.createElement("span");
      newSpan.classList.add("todo-text");
      newSpan.textContent = todo.text;
      newSpan.dataset.action = "toggle";
      input.replaceWith(newSpan);
    }
  });

  input.addEventListener("blur", saveEdit);
}

// Event Delegation
todoList.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.dataset.action === "delete") deleteTodo(id);
  if (e.target.dataset.action === "toggle") toggleTodo(id);
});

todoList.addEventListener("dblclick", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  if (e.target.classList.contains("todo-text")) startEdit(li.dataset.id);
});

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    todoList.querySelectorAll(".todo-item").forEach((li) => {
      const todo = todos.find((t) => t.id === li.dataset.id);
      li.classList.remove("hidden");
      if (currentFilter === "active" && todo.completed) li.classList.add("hidden");
      if (currentFilter === "completed" && !todo.completed) li.classList.add("hidden");
    });
  });
});

clearCompleted.addEventListener("click", () => {
  todos = todos.filter((t) => !t.completed);
  save();
  render();
});

render();
