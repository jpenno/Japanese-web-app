// load jquery
var script = document.createElement("script");
script.src = "//code.jquery.com/jquery-1.11.0.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

// Kanji class
class Kanji {
  constructor(character, meaning, kunReading, onReading, jisyoLink) {
    this.character = character;
    this.meaning = meaning;
    this.kunReading = kunReading;
    this.onReading = onReading;
    this.jisyoLink = jisyoLink;
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
    const res = await fetch("/kanji", {
      method: "post",
      body: JSON.stringify({
        character: kanji.character,
        meaning: kanji.meaning,
        kunReading: kanji.kunReading,
        onReading: kanji.onReading,
        jisyoLink: kanji.jisyoLink
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

$("#add-one-kanji").click(e => {
  // Prevent actual submit
  e.preventDefault();

  const character = document.getElementById("kanji-User-Input").value;
  const meaning = document.getElementById("meaning-User-Input").value;
  const kunReading = document.getElementById("kunreading-User-Input").value;
  const OnReading = document.getElementById("onreading-User-Input").value;
  const jisyoLink = document.getElementById("jisyoLink-User-Input").value;

  const userkanji = new Kanji(
    character,
    meaning,
    kunReading,
    OnReading,
    jisyoLink
  );
  Store.addkanji(userkanji);
});

$("#add-kanji-csv").click(async e => {
  // Prevent actual submit
  e.preventDefault();
  console.log("add-csv click");
  const csv = $('#kanji-csv-User-Input').val();
  const res =  await fetch("/kanji/csv", {
      method: "post",
      body: JSON.stringify({
        kanjiData: csv,
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
  document.getElementById("kunreading-User-Input").value = "";
  document.getElementById("onreading-User-Input").value = "";
  document.getElementById("jisyoLink-User-Input").value = "";
};
