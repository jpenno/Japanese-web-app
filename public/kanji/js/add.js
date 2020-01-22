document.addEventListener("DOMContentLoaded", e => {
});

// Kanji class
class Kanji {
  constructor(character, meaning) {
    this.character = character;
    this.meaning = meaning;
  }
}

// Store Class: Handle Storage
class Store {
  static GetKanji() {
    let kanjis;
    // check if saved data exists
    if (localStorage.getItem("kanjis") === null) {
      // if save data docent exists return empty arry
      return [];
    } else {
      // if save data exists return save data
      return JSON.parse(localStorage.getItem("kanjis"));
    }
  }

  // add kanji to database
  static addkanji(kanji) {
    fetch("/", {
      method: "post",
      body: JSON.stringify({
        character: kanji.character,
        meaning: kanji.meaning
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }
}

class UI {
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} infomsg`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#Kanji-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

document.getElementById("Kanji-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();
  console.log("Test");
  const character = document.getElementById("kanji-User-Input").value;
  const meaning = document.getElementById("meaning-User-Input").value;

  const userkanji = new Kanji(character, meaning);

  // check that the fields are filled out
  if (userkanji.character === "" || userkanji.meaning === "") {
    UI.showAlert("please fill in all fields", "danger");
  } // check that just one kanji gets entered
  else if (userkanji.character.length != 1) {
    UI.showAlert("check kanji input", "danger");
  } else {
    Store.addkanji(userkanji);
  }
  // clear the input fields
  document.getElementById("kanji-User-Input").value = "";
  document.getElementById("meaning-User-Input").value = "";
});
