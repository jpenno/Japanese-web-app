async function getKanji(kanji) {
  const res = await fetch(`/kanji/getkanji/${kanji}`, { method: "get" });
  const data = await res.json();
  if(data.length == 1){
    return data[0];
  }else{
    return false;
  }
}

function isKanji(ch) {
  return (
    (ch >= "\u4e00" && ch <= "\u9faf") || (ch >= "\u3400" && ch <= "\u4dbf")
  );
}

$("#add-word").click(async e => {
  // Prevent actual submit
  e.preventDefault();

  var errorHappened = false;

  const word = $("#word-user-input").val();
  const reading = $("#reading-user-input").val();
  const meaning = $("#meaning-user-input").val();
  const jisyoLink = $("#jisyoLink-user-input").val();

  let needToAddList = [];
  let kanjiList = [];

  for(i = 0; i < word.length; i++){
    if (isKanji(word[i])) {
      // get the kanji from the database
      const kanjiID = await getKanji(word[i]);
      if (kanjiID != false) {
        kanjiList.push(kanjiID._id);
      } else {
        errorHappened = true;
        needToAddList.push(word[i]);
      }
    }
  }

  // check if the user needs to add kanji
  if (needToAddList.length > 0) {
    errorHappened = true;
    // let the user know what kanji they need to add
    displayMessage(false, `need to add ${needToAddList}`);
  }

  // check that no errors happened
  if (errorHappened == false) {
    console.log(kanjiList);
    // let the user know that the vocab was added
    displayMessage(true, `added ${word}`);
    const vocab = {
      word: word,
      meaning: meaning,
      reading: reading,
      jisyoLink: jisyoLink,
      kanjiInWord: kanjiList
    };
    addVocab(vocab);
  }
});

const displayMessage = (flag, msg) => {
  const message = $("#message");
  // successful
  if (flag) {
    message.removeClass("alert-warning");
    message.addClass("alert-success");
    message.html(msg);
    message.show();
  } else {
    message.removeClass("alert-success");
    message.addClass("alert-warning");
    message.html(msg);
    message.show();
  }
};

async function addVocab(vocab) {
  const res = await fetch("/vocab", {
    method: "post",
    body: JSON.stringify({
      word: vocab.word,
      meaning: vocab.meaning,
      reading: vocab.reading,
      jisyoLink: vocab.jisyoLink,
      kanjiInWord: vocab.kanjiInWord
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

const ClearUserInput = () => {
  $("#word-user-input").val("");
  $("#reading-user-input").val("");
  $("#meaning-user-input").val("");
  $("#jisyoLink-user-input").val("");
};
