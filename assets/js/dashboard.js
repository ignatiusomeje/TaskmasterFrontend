const addNewTodo = document.getElementById("addNewTodo");
// const addNewBoard = document.getElementById("addNewBoard");
const modal = document.getElementById("modal");
const modalContainer = document.getElementById("modalContainer");
const modalBoard = document.getElementById("modalBoard");
const modalContainerBoard = document.getElementById("modalContainerBoard");
const form = document.getElementById("form");
const boardForm = document.getElementById("boardForm");
const boardNumber = document.getElementById("boardNumber");
const boardList = document.querySelector(".boardList");
const todoColumn = document.getElementById("todoColumn");
const doingColumn = document.getElementById("doingColumn");
const doneColumn = document.getElementById("doneColumn");
const todoTotal = document.getElementById("todoTotal");
const doingTotal = document.getElementById("doingTotal");
const doneTotal = document.getElementById("doneTotal");
const sideBarIcon = document.getElementById("sideBarIcon");
const getSideBar = document.getElementById("asideBar");

const api = axios.create({
  baseURL: `https://taskmaster-tauu.onrender.com/api/v1`,
  // baseURL: `http://localhost:3002/api/v1/`,
  //   baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
});

let selected = "";
let selectedId = "";

addNewTodo.addEventListener("click", () => {
  modal.classList.toggle("display");
});

// addNewBoard.addEventListener("click", () => {
//   modalBoard.classList.toggle("display");
// });

let user;

getUserCredentials();

function getUserCredentials() {
  const savedCredentials = localStorage.getItem("TaskMaster");

  if (savedCredentials) {
    user = JSON.parse(savedCredentials);
  } else {
    return null;
  }
}

if (!user) {
  window.location.href = "/login.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = new FormData(e.target);
  const taskModified = {};
  task.forEach((value, name) => (taskModified[name] = value));
  taskModified.status = "todo";
  createATask(user.token, taskModified);
  // console.log(taskModified, "see me here");
  // // addTaskToBoard(taskModified);
  modal.classList.toggle("display");
  form.reset();
  // return displayBoards();
});

const searchBar = document.getElementById("searchBar");
const filterIcon = document.getElementById("filterIcon");
const filterDropdown_btn = document.querySelectorAll(".filterDropdown_btn");
const filterDropdown = document.getElementById("filterDropdown");
const searchInput = document.getElementById("searchInput");

// Toggle the dropdown visibility on button click
filterIcon.addEventListener("click", () => {
  filterDropdown.classList.toggle("show");
});

// Close the dropdown if clicking outside
window.addEventListener("click", (event) => {
  if (
    !filterIcon.contains(event.target) &&
    !filterDropdown.contains(event.target)
  ) {
    filterDropdown.classList.remove("show");
  }
});

// Close the dropdown if you click on any of the buttons
filterDropdown_btn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    filterDropdown.classList.toggle("show");
    searchInput.value = "";
    if (event.target.textContent === "All") {
      return fetchTasks(user.token);
    }
    fetchTasks(user.token, "priority", event.target.textContent);
  });
});

boardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = new FormData(e.target);
  const taskModified = {};
  task.forEach((value, name) => (taskModified[name] = value));
  const { title, description, deadline, priority } = taskModified;
  updateATask(user.token, taskModified.id, {
    title,
    description,
    deadline,
    priority,
  });
  fetchTasks(user.token);
  modalBoard.classList.toggle("display");
  boardForm.reset();
});

searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = new FormData(e.target);
  const taskModified = {};
  task.forEach((value, name) => (taskModified[name] = value));
  const { title } = taskModified;
  fetchTasks(user.token, "title", title);
  // modalBoard.classList.toggle("display");
  // boardForm.reset();
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.id === "modalContainer") {
    modal.classList.toggle("display");
    form.reset();
  }
});

const alertMixin = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  timer: 3000, // Auto-close after 2 seconds
});

modalContainerBoard.addEventListener("click", (e) => {
  if (e.target.id === "modalContainerBoard") {
    modalBoard.classList.toggle("display");
    boardForm.reset();
  }
});

fetchTasks(user.token);
/* Read Tasks */
function fetchTasks(token, queryName, queryValue) {
  let query = api
    .get(`/tasks${queryName ? `?${queryName}=${queryValue}` : "/"}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    .then((value) => {
      displayBoardTasks(value.data.message);
    })
    .catch((err) => {
      alertMixin.fire({
        icon: "error",
        title: "Error Fetching Tasks",
        text: err?.response?.data?.message || err.message,
      });
    });
}
/* Create a task */
function createATask(token, task) {
  api
    .post("/tasks", JSON.stringify(task), {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      alertMixin.fire({
        icon: "success",
        title: "Task Created",
        text: "Tasks created successfully",
      });
      fetchTasks(token);
    })
    .catch((err) => {
      alertMixin.fire({
        icon: "error",
        title: "Error Creating Task",
        text: err?.response?.data?.message || err.message,
      });
    });
}
/* Update a Task */
function updateATask(token, id, task) {
  api
    .put(`/tasks/${id}`, JSON.stringify(task), {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    .then((value) => {
      alertMixin.fire({
        icon: "success",
        title: "Task Updated",
        text: `Task Updated Successfully`,
      });
      fetchTasks(token);
      // displayBoardTasks(value.data.message);
    })
    .catch((err) => {
      alertMixin.fire({
        icon: "error",
        title: "Error Creating Task",
        text: err?.response?.data?.message || err.message,
      });
    });
}
/* Delete a task */
function deleteATask(token, id) {
  api
    .delete(`/tasks/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((value) => {
      alertMixin.fire({
        icon: "success",
        title: "Task deleted",
        text: `Task deleted Successfully`,
      });
      fetchTasks(token);
    })
    .catch((err) => {
      alertMixin.fire({
        icon: "error",
        title: "Error Creating Task",
        text: err?.response?.data?.message || err.message,
      });
    });
}

function displayBoardTasks(Tasks) {
  const tasks = Tasks;
  doingColumn.innerHTML = "";
  doneColumn.innerHTML = "";
  todoColumn.innerHTML = "";
  doingTotal.textContent = "";
  doneTotal.textContent = "";
  todoTotal.textContent = "";

  doingColumn.append(createDropzone());
  doneColumn.append(createDropzone());
  todoColumn.append(createDropzone());

  if (tasks.length > 0) {
    const doing = tasks.filter((task) => task.status.toLowerCase() === "doing");
    const done = tasks.filter((task) => task.status.toLowerCase() === "done");
    const todo = tasks.filter((task) => task.status.toLowerCase() === "todo");

    if (doing.length !== 0) {
      doingTotal.textContent = `(${doing?.length})`;
      doing.map((doingTask) => createTaskElementMethod(doingTask, doingColumn));
    } else {
      doingTotal.textContent = `(${doing?.length})`;
    }

    if (done.length !== 0) {
      doneTotal.textContent = `(${done?.length})`;
      done.map((doneTask) => createTaskElementMethod(doneTask, doneColumn));
    } else {
      doneTotal.textContent = `(${done?.length})`;
    }

    if (todo.length !== 0) {
      todoTotal.textContent = `(${todo?.length})`;
      todo.map((todoTask) => createTaskElementMethod(todoTask, todoColumn));
    } else {
      todoTotal.textContent = `(${todo?.length})`;
    }
  } else {
    doingTotal.textContent = "";
    doneTotal.textContent = "";
    todoTotal.textContent = "";
  }
}

function createDropzone() {
  const range = document.createRange();
  range.selectNode(document.body);
  const dropZone = range.createContextualFragment(`
    <div class="dropzone"></div>
    `).children[0];

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dropzone-active");
  });

  dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dropzone-active");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dropzone-active");

    const columnElement = dropZone.closest(".todos_column");
    const columnName =
      columnElement.id && columnElement.id === "doingColumn"
        ? "doing"
        : columnElement.id === "doneColumn"
        ? "done"
        : columnElement.id === "todoColumn" && "todo";
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));
    item.status = columnName;

    updateATask(user.token, item._id, item);
    fetchTasks(user.token);
  });

  return dropZone;
}

function createTaskElementMethod(task, column) {
  const div = document.createElement("div");
  const dropZone = createDropzone();

  div.setAttribute("class", "todo_row");
  div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  });
  div.draggable = true;
  div.innerHTML = `
              <div class="todoHeader ${
                task.priority === "low"
                  ? `low`
                  : task.priority === "medium"
                  ? `medium`
                  : `high`
              }">
                <span>${task.title}</span>
                <span class="icofont-ui-delete"></span>
              </div>
              <p class="taskDesc">
                ${task.description}
              </p>
              <div class="taskFooter ${
                task.priority === "low"
                  ? `low`
                  : task.priority === "medium"
                  ? `medium`
                  : `high`
              }">
                <span>due: ${new Date(
                  task.deadline
                ).toLocaleDateString()}</span>
                <button type="button" class="btnTask">Edit</button>
              </div>
            `;
  const TaskToDelete = div.querySelector(".icofont-ui-delete");
  TaskToDelete.addEventListener("click", () => {
    deleteATask(user.token, task._id);
  });
  const edit = div.querySelector(".btnTask");
  edit.addEventListener("click", () => {
    const title = boardForm.querySelector("[name=title]");
    const description = boardForm.querySelector("[name=description]");
    const deadline = boardForm.querySelector("[name=deadline]");
    const id = boardForm.querySelector("[name=id]");
    const priority = boardForm.querySelector("[name=priority]");
    const status = boardForm.querySelector("[name=status]");
    title.value = task.title;
    description.value = task.description;
    deadline.value = new Date(task.deadline).toISOString().slice(0, 16);
    id.value = task._id;
    priority.value = task.priority;
    status.value = task.status;
    modalBoard.classList.toggle("display");
  });
  div.addEventListener("drop", (e) => e.preventDefault());
  // p.addEventListener("blur", (e) => {
  //   const oldItem = text.title;

  //   if (oldItem !== p.textContent) {
  //     updateItems(text.id, { content: p.textContent });
  //     const allItem = readLocalHost();
  //     const item = allItem.find((column) =>
  //       column.tasks.find((task) => task.id === text.id)
  //     );
  //     const toBeUpdated = item.tasks.filter((task) => task.id === text.id);
  //     toBeUpdated[0].title = p.textContent;
  //     writeToLocalHost(allItem);
  //     displayBoardTasks();
  // }
  // });
  // div.append(p);
  // const span = document.createElement("span");
  // span.setAttribute("class", "icofont-ui-delete");
  // span.addEventListener("click", () => {
  //   const allBoard = readLocalHost();
  //   const boardFetched = allBoard.filter((file) => file.name === selected);
  //   boardFetched[0].tasks = boardFetched[0].tasks.filter(
  //     (task) => task.title !== text.title && task.id !== text.id
  //   );
  //   writeToLocalHost(allBoard);
  //   displayBoardTasks();
  // });
  // div.append(span);
  column.append(div);
  column.append(dropZone);
}

// // SIDEBAR TOGGLE FUNCTION
// getSideBar.style.display = "none";
// sideBarIcon.addEventListener("click", () => {
//   if ((getSideBar.style.display = "none")) {
//     getSideBar.style.display = "block";
//   } else {
//     getSideBar.style.display = "none";
//   }
// });
