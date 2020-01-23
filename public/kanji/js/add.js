// load jquery
var script = document.createElement("script");
script.src = "//code.jquery.com/jquery-1.11.0.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

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
  static async addkanji(kanji) {
    const res = await fetch("/", {
      method: "post",
      body: JSON.stringify({
        character: kanji.character,
        meaning: kanji.meaning
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    const data = await res.json();

    if (data.error) {
      displayMessage(false, data.error.message);
    } else {
      displayMessage(true, data.msg);
      ClearUserInput();
    }
  }
}

document.getElementById("Kanji-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  const character = document.getElementById("kanji-User-Input").value;
  const meaning = document.getElementById("meaning-User-Input").value;

  const userkanji = new Kanji(character, meaning);
  Store.addkanji(userkanji);


  // // check that the fields are filled out
  // if (userkanji.character === "" || userkanji.meaning === "") {
  //   UI.showAlert("please fill in all fields", "danger");
  // } // check that just one kanji gets entered
  // else if (userkanji.character.length != 1) {
  //   UI.showAlert("check kanji input", "danger");
  // } else {
  //   Store.addkanji(userkanji);
  // }
});

const displayMessage = (flag, msg) => {
  const message = $("#message");
  // successful
  if (flag) {
    message.removeClass("alert-danger");
    message.addClass("alert-success");
    message.html(msg);
    message.show();
  } else {
    message.removeClass("alert-success");
    message.addClass("alert-danger");
    message.html(msg);
    message.show();
  }
};

const ClearUserInput = () => {
  document.getElementById("kanji-User-Input").value = "";
  document.getElementById("meaning-User-Input").value = "";
};
