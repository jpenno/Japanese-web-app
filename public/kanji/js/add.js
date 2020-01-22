document.addEventListener("DOMContentLoaded", e => {
  console.log(Store.GetKanji());
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
      // if save data dosent exists return empty arry
      return [];
    } else {
      // if save data exists return save data
      return JSON.parse(localStorage.getItem("kanjis"));
    }
  }

  // save kanji to local storage
  static addkanji(kanji) {
    const kanjis = Store.GetKanji();
    kanjis.push(kanji);
    localStorage.setItem("kanjis", JSON.stringify(kanjis));
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
  }// check that just one kanji gets enterd
  else if(userkanji.character.length != 1){
    UI.showAlert("check kanji input", "danger");
  }else {
    const kanjis = Store.GetKanji();
    var copy = false;
    // check if the kanji being added is allready there
    kanjis.forEach(kanji => {
      if (userkanji.character === kanji.character) {
        copy = true;
      }
    });

    if (copy) {
      UI.showAlert("copy", "danger");
    }else{
      Store.addkanji(userkanji);
    }
  }
  // clear the input fields
  document.getElementById("kanji-User-Input").value = "";
  document.getElementById("meaning-User-Input").value = "";
});
