const addNewTodo = document.getElementById("addNewTodo");
const addNewBoard = document.getElementById("addNewBoard");
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

let selected = "";
let selectedId = "";

addNewTodo.addEventListener("click", () => {
  modal.classList.toggle("display");
});

addNewBoard.addEventListener("click", () => {
  modalBoard.classList.toggle("display");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = new FormData(e.target);
  const taskModified = {
    title: task.get("title"),
    status: "Todo",
  };
  addTaskToBoard(taskModified);
  modal.classList.toggle("display");
  form.reset();
  return displayBoards();
});

boardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const boardName = new FormData(e.target);
  addToDisplayBoard(boardName.get("boardName"));
  modalBoard.classList.toggle("display");
  boardForm.reset();
  return displayBoards();
  // console.log(boardName.get("boardName"),"see me here")
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.id === "modalContainer") {
    modal.classList.toggle("display");
    form.reset();
  }
});

modalContainerBoard.addEventListener("click", (e) => {
  if (e.target.id === "modalContainerBoard") {
    modalBoard.classList.toggle("display");
    boardForm.reset();
  }
});

function displayBoards() {
  const boards = readLocalHost();
  boardList.innerHTML = "";

  if (boards.length > 0) {
    boards.map((board, key) => {
      const p = document.createElement("p");
      const i = document.createElement("i");
      if (selected === board.name) {
        p.setAttribute("class", "active");
      } else if (!selected) {
        if (key === 0) {
          selected = board.name;
          p.setAttribute("class", "active");
        }
      }
      i.setAttribute("class", "icofont-ghost");
      p.append(i);
      p.append(board.name);
      boardNumber.textContent = `(${boards.length})`;
      boardList.append(p);
      p.addEventListener("click", () => {
        selected = board.name;
        displayBoards();
        displayBoardTasks();
      });
    });
  }
}

displayBoards();

function addToDisplayBoard(boardName) {
  const boards = readLocalHost();
  const id = Math.floor(Math.random() * 1000000);

  const newBoard = {
    id,
    name: boardName,
    tasks: [],
  };

  if (boards.length === 0) {
    const newBoards = [...boards, newBoard];
    writeToLocalHost(newBoards);
    selected = boardName;
    displayBoards();
    return displayBoardTasks();
  }

  selected = boardName;

  const newBoards = [newBoard, ...boards];
  writeToLocalHost(newBoards);
  displayBoards();
  return displayBoardTasks();
}

function displayBoardTasks() {
  const column = readLocalHost().find((column) => column.name === selected);
  // const dropZone = createDropzone();
  const tasks = column.tasks;
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
    // .reverse();
    const done = tasks.filter((task) => task.status.toLowerCase() === "done");
    // .reverse();
    const todo = tasks.filter((task) => task.status.toLowerCase() === "todo");
    // .reverse();

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

displayBoardTasks();

function createDropzone() {
  const range = document.createRange();
  range.selectNode(document.body);
  const dropZone = range.createContextualFragment(`
    <div class="dropzone"></div>
    `).children[0];

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    // debugger;
    dropZone.classList.add("dropzone-active");
  });

  dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dropzone-active");
  });

  dropZone.addEventListener("drop", (e) => {
    // debugger;

    // console.log("i'm working");
    e.preventDefault();
    dropZone.classList.remove("dropzone-active");

    const columnElement = dropZone.closest(".todos_column");
    const columnName =
      columnElement.id && columnElement.id === "doingColumn"
        ? "Doing"
        : columnElement.id === "doneColumn"
        ? "Done"
        : columnElement.id === "todoColumn" && "Todo";
    const dropZonesInColumn = Array.from(
      columnElement.querySelectorAll(".dropzone")
    );
    console.log(dropZonesInColumn, "check this out");
    const droppedIndex = dropZonesInColumn.indexOf(dropZone);
    console.log(droppedIndex, "laskdljskdjlskj");
    const itemId = Number(e.dataTransfer.getData("text/plain"));
    updateItems(itemId, { status: columnName, position: droppedIndex });
    displayBoardTasks();
    // console.log(itemId);
  });

  return dropZone;
}

function createTaskElementMethod(text, column) {
  const div = document.createElement("div");
  const dropZone = createDropzone();

  div.setAttribute("class", "todo_row");
  div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", text.id);
  });
  div.draggable = true;
  const p = document.createElement("p");
  p.textContent = text.title;
  p.contentEditable = true;
  p.addEventListener("drop", (e) => e.preventDefault());
  p.addEventListener("blur", (e) => {
    const oldItem = text.title;

    if (oldItem !== p.textContent) {
      updateItems(text.id, { content: p.textContent });
      const allItem = readLocalHost();
      const item = allItem.find((column) =>
        column.tasks.find((task) => task.id === text.id)
      );
      const toBeUpdated = item.tasks.filter((task) => task.id === text.id);
      toBeUpdated[0].title = p.textContent
      writeToLocalHost(allItem);
      displayBoardTasks();

      // console.log(toBeUpdated,"here we are")
    }
  });
  div.append(p);
  const span = document.createElement("span");
  span.setAttribute("class", "icofont-ui-delete");
  span.addEventListener("click", () => {
    const allBoard = readLocalHost();
    const boardFetched = allBoard.filter((file) => file.name === selected);
    boardFetched[0].tasks = boardFetched[0].tasks.filter(
      (task) => task.title !== text.title && task.id !== text.id
    );
    writeToLocalHost(allBoard);
    displayBoardTasks();
  });
  div.append(span);
  column.append(div);
  column.append(dropZone);
}

// function updateItems(itemId, newProp) {
//   const allBoards = readLocalHost();
//   const board = allBoards.find(board => board.tasks.some(task => task.id === itemId));

//   if (board) {
//     const taskIndex = board.tasks.findIndex(task => task.id === itemId);
//     const task = board.tasks[taskIndex];

//     // Update status if changed
//     if (newProp.status && newProp.status !== task.status) {
//       task.status = newProp.status;
//     }

//     // Remove the task from its current position
//     board.tasks.splice(taskIndex, 1);

//     // Insert the task at the new position
//     board.tasks.splice(newProp.position, 0, task);

//     writeToLocalHost(allBoards);
//   }
// }

function updateItems(itemId, newProp) {
  const allItem = readLocalHost();
  debugger;
  const item = allItem.find((column) =>
    column.tasks.find((task) => task.id === itemId)
  );

  if (item) {
    const needed = item.tasks.filter((task) => task.id === itemId);
    if ((newProp.position === 0 || newProp.position) && newProp.status) {
      // const reversed = item.tasks.reverse()
      const arrangedTodo = item.tasks.filter(
        (task) => task.status === newProp.status
      );
      console.log(arrangedTodo[newProp.position], "see me here");
      console.log(newProp.position, "see hmmmm me here");
      if (arrangedTodo[newProp.position] !== undefined) {
        const indexOfItemAfterLanding = arrangedTodo.findIndex(
          (task) => task.id === arrangedTodo[newProp.position].id
        );
        const arrayOfOld = arrangedTodo[indexOfItemAfterLanding];
        const biggerArrayIndex = item.tasks.findIndex(
          (task) => task.id === arrayOfOld.id
        );
        // done
        const indexNewArray = item.tasks.findIndex(
          (task) => task.id === itemId
        );
        arrangedTodo.splice(biggerArrayIndex, 1);
        needed[0].status = newProp.status ? newProp.status : needed[0].status;
        // needed[0].title =
        // newProp.content === undefined ? needed[0].title : newProp.content;

        arrangedTodo.splice(indexNewArray, 0, needed[0]);
      } else {
        const indexNewArray = item.tasks.findIndex(
          (task) => task.id === itemId
        );
        // arrangedTodo.splice(biggerArrayIndex, 1);
        needed[0].status = newProp.status ? newProp.status : needed[0].status;
        // needed[0].title =
        // newProp.content === undefined ? needed[0].title : newProp.content;

        arrangedTodo.splice(indexNewArray, 0, needed[0]);
      }

      // const findIndexToRemove = arrangedTodo.findLastIndex(
      //   (task) => task.id === needed[0].id
      // );

      // arrangedTodo.splice(findIndexToRemove, 1);

      // arrangedTodo.splice(newProp.position, 0, needed[0]);

      
        // needed[0].title =
        //   newProp.content === undefined ? needed[0].title : newProp.content;
      

      return writeToLocalHost(allItem);
      // // const allItem = readLocalHost();
      // // const item = allItem.find((column) =>
      // //   column.tasks.find((task) => task.status === newProp.status)
      // // );
      // console.log(arrangedTodo, "see me here");
    }

    // const needed = item.tasks.filter((task) => task.id === itemId);
    // needed[0].status = newProp.status ? newProp.status : needed[0].status;
    needed[0].title =
      newProp.content === undefined ? needed[0].title : newProp.content;
    // return writeToLocalHost(allItem);
  }

  // 1:21:49
}

function addTaskToBoard(task) {
  const allBoard = readLocalHost();
  const boardFetched = allBoard.filter((file) => file.name === selected);
  const newBody = {
    id: Math.floor(Math.random() * 1000000),
    title: task.title,
    status: task.status,
  };

  if (boardFetched.length > 0 || boardFetched.length === 0) {
    boardFetched[0].tasks.push(newBody);

    writeToLocalHost(allBoard);
    displayBoardTasks();
  }
  // id:number,
  //   title:string,
  //   status:number[0=todo,1=doing,2=done]
}

function getColumnItems(id, status) {
  const items = readLocalHost().find((column) => {
    if (column.id === id) {
      return column.tasks.find((task) => task.status === status);
    }
  });

  if (!items) {
    return [];
  }

  return items;
}

function insertItem(id, content) {
  const items = readLocalHost();

  const column = items.find((column) => column.id === id);

  if (!column) {
    throw new Error("Invalid Column");
  }

  column.tasks.push(content);

  writeToLocalHost(items);
}

function readLocalHost() {
  const data = localStorage.getItem("m-plan-data");

  if (!data) {
    return [
      // {
      //   id: 0,
      //   name: "default",
      //   tasks: [],
      // },
    ];
  }

  return JSON.parse(data);
}

function writeToLocalHost(data) {
  localStorage.setItem("m-plan-data", JSON.stringify(data));
}

/* 
[{
  id:number
  name:string,
  tasks:[
  {
    id:number,
    title:string,
    status:number[0=todo,1=doing,2=done]
  }
  ]
}]
*/
