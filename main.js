// Lade gespeicherte Karten beim Laden der Seite
window.onload = function () {
  let savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    savedTasks.forEach(function (task) {
      createCard(task.title, task.description);
    });
  }
};
// Überprüfe welcher Button gesetzt ist
function performAction() {
  let actionBtn = document.getElementById("actionBtn");
  if (actionBtn.textContent === "Hinzufügen") {
    addTask();
  } else if (actionBtn.textContent === "Speichern") {
    saveTask();
  }
}
//Hinzufügen
function addTask() {
  let titleInput = document.getElementById("taskTitle");
  let descriptionInput = document.getElementById("taskDescription");
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // Überprüfen, ob Titel oder Beschreibung leer sind
  if (title === "" || description === "") {
    alert("Bitte füllen Sie alle Felder aus.");
    return; // Stoppe die Funktion hier, wenn eines der Felder leer ist
  }

  // Überprüfen, ob die Karte bereits vorhanden ist
  if (!isDuplicate(title, description)) {
    createCard(title, description);
    saveTasks();

    titleInput.value = "";
    descriptionInput.value = "";
  } else {
    alert("Diese Karte existiert bereits.");
  }
}
// Erstelle eine neue Karte.....
function createCard(title, description) {
  title = escapeHtml(title);
  description = escapeHtml(description);
  let taskCards = document.getElementById("taskCards");
  let card = document.createElement("div");
  card.className = "card";
  card.innerHTML = "<h3>" + title + "</h3><p>" + description + "</p>";

  // Erstellen des Löschen-Buttons in der Karte
  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "X";
  deleteBtn.style.display = "none"; // Verstecke den Löschen-Button standardmäßig
  deleteBtn.onclick = function (event) {
    event.stopPropagation(); // Verhindere das Auslösen des Klick-Events für die Karte
    taskCards.removeChild(card); // Entferne die Karte aus dem DOM
    saveTasks();
  };
  card.appendChild(deleteBtn);

  // Erstellen des Abhaken-Buttons in der Karte
  let checkBtn = document.createElement("button");
  checkBtn.className = "check-btn";
  checkBtn.textContent = "✓";
  checkBtn.onclick = function (event) {
    event.stopPropagation(); // Verhindere das Auslösen des Klick-Events für die Karte
    card.classList.toggle("checked"); // Füge oder entferne die "checked"-Klasse
    if (card.classList.contains("checked")) {
      deleteBtn.style.display = "inline"; // Zeige den Löschen-Button, wenn die Karte abgehakt ist
      checkBtn.style.display = "none"; // Verstecke den Haken-Button, wenn die Karte abgehakt ist
    } else {
      deleteBtn.style.display = "none"; // Verstecke den Löschen-Button, wenn die Karte nicht abgehakt ist
      checkBtn.style.display = "inline"; // Zeige den Haken-Button, wenn die Karte nicht abgehakt ist
    }
    saveTasks();
  };
  card.appendChild(checkBtn);

  // Hinzufügen eines Event-Handlers für das Bearbeiten der Karte
  card.addEventListener("click", function () {
    // Entfernen der "active" Klasse von allen Karten
    document.querySelectorAll(".card").forEach(function (card) {
      card.classList.remove("active");
    });

    // Hinzufügen der "active" Klasse zur geklickten Karte
    card.classList.add("active");
    let titleText = card.querySelector("h3").textContent;
    let descriptionText = card.querySelector("p").textContent;

    // Aktualisierung der Eingabefelder mit den Karteninformationen
    document.getElementById("taskTitle").value = titleText;
    document.getElementById("taskDescription").value = descriptionText;

    // Ändern des Buttons von "Hinzufügen" auf "Speichern"
    let actionBtn = document.getElementById("actionBtn");
    actionBtn.textContent = "Speichern";
    actionBtn.onclick = function () {
      updateTask(card);
    };

    // Zeige den Neu-Button
    document.getElementById("resetBtn").style.display = "inline";

    // Zeige den Lösch-Button
    document.getElementById("killBtn").style.display = "inline";
  });

  taskCards.appendChild(card);
}
// Karte updaten....
function updateTask(card) {
  let titleInput = document.getElementById("taskTitle");
  let descriptionInput = document.getElementById("taskDescription");
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  if (title === "" || description === "") {
    alert("Titel und Beschreibung dürfen nicht leer sein.");
    return;
  }

  let cardTitle = card.querySelector("h3");
  let cardDescription = card.querySelector("p");

  cardTitle.textContent = title;
  cardDescription.textContent = description;

  // Ändern des Buttons von "Speichern" auf "Hinzufügen"
  let actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Hinzufügen";
  actionBtn.onclick = addTask;

  // Verstecke den Neu-Button
  document.getElementById("resetBtn").style.display = "none";

  saveTasks(); // Speichere die aktualisierten Karten im Local Storage
  titleInput.value = ""; // Eingabefeld nach Speichern der Aufgabe leeren
  descriptionInput.value = ""; // Eingabefeld nach Speichern der Aufgabe leeren
}
// Karte löschen...
function deleteCard() {
  console.log("Kill-Button wurde geklickt");
  let card = document.querySelector(".card.checked"); // Zugriff auf die ausgewählte Karte, die gerade bearbeitet wird
  let taskCards = document.getElementById("taskCards");
  if (card) {
    taskCards.removeChild(card); // Entferne die Karte aus dem DOM
    saveTasks(); // Aktualisiere den Local Storage
  } else {
    console.error("Es wurde keine ausgewählte Karte gefunden.");
  }
}

// gibt es die Karte schon...
function isDuplicate(title, description) {
  let taskCards = document
    .getElementById("taskCards")
    .querySelectorAll(".card");
  for (let i = 0; i < taskCards.length; i++) {
    let cardTitle = taskCards[i].querySelector("h3").textContent;
    let cardDescription = taskCards[i].querySelector("p").textContent;
    if (title === cardTitle && description === cardDescription) {
      return true; // Karte bereits vorhanden
    }
  }
  return false; // Karte nicht gefunden
}
//Speichern...
function saveTasks() {
  let taskCards = Array.from(
    document.getElementById("taskCards").querySelectorAll(".card")
  );
  let tasks = [];
  taskCards.forEach(function (card) {
    let title = card.querySelector("h3").textContent;
    let description = card.querySelector("p").textContent;
    tasks.push({ title: title, description: description });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Suche nach einer Karte...
function searchTasks() {
  let input, filter, cards, card, title, description, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  cards = document.getElementById("taskCards").getElementsByClassName("card");

  for (i = 0; i < cards.length; i++) {
    card = cards[i];
    title = card.getElementsByTagName("h3")[0];
    description = card.getElementsByTagName("p")[0];
    if (
      title.textContent.toUpperCase().indexOf(filter) > -1 ||
      description.textContent.toUpperCase().indexOf(filter) > -1
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  }
}
// Leere die Eingabefelder
function clearFields() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
}
// Button zurücksetzten...
function resetFields() {
  clearFields();
  // Entferne die "active" Klasse von allen Karten
  document.querySelectorAll(".card").forEach(function (card) {
    card.classList.remove("active");
  });

  let actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Hinzufügen";
  actionBtn.onclick = addTask;
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("killBtn").style.display = "none";
}
//Sicherheit...
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
