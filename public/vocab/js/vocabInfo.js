var infoVocabID = window.location.hash.substring(1);
// get vocab
async function getVocab() {
  const res = await fetch(`/vocab/${infoVocabID}`, { method: "get" });
  //const res = await fetch(`/kanji`, { method: "get" });
  const data = await res.json();
  return data[0];
}
async function getKanji(kanjiID) {
  const res = await fetch(`/kanji/${kanjiID}`, { method: "get" });
  //const res = await fetch(`/kanji`, { method: "get" });
  const data = await res.json();
  return data[0];
}

$(document).ready(async () => {
  const vocab = await getVocab();

  // set word
  $("#word").html(vocab.word);
  // set furugana
  $("#furugana").html(vocab.reading);
  // set word meaning
  $("#meaning").html(vocab.meaning);

  // build kanji in word list
  vocab.kanjiInWord.forEach(async kanjiID => {
    buildKanjiInfo(await getKanji(kanjiID));
  });
});

const buildKanjiInfo = kanji => {
  kanjiInWordDiv = $("#kanji-in-word");

  const kanjiInfoCol = $("<div>");
  kanjiInfoCol.addClass("col-sm-12 kanjiColl");
  kanjiInfoCol.addClass("kanjiColl");

  const kanjiRow = $("<div>");
  kanjiRow.addClass("row");

  const wordCol = $("<div>");
  wordCol.addClass("col-sm-2");

  const word = $("<a>");
  word.attr("href", "#");
  word.addClass("kanji");
  word.html(kanji.character);

  wordCol.append(word);
  kanjiRow.append(wordCol);

  const infoCol = $("<div>");
  infoCol.addClass("col-sm-10");

  const meaningRow = $("<div>");
  meaningRow.addClass("row kanjiMeanings text-info");
  meaningRow.html(kanji.meaning);
  infoCol.append(meaningRow);

  const kunReadingRow = $("<div>");
  kunReadingRow.addClass("row kunReading text-info");
  kunReadingRow.html(kanji.kunReading);
  infoCol.append(kunReadingRow);

  const onReadingRow = $("<div>");
  onReadingRow.addClass("row onReading text-info");
  onReadingRow.html(kanji.onReading);
  infoCol.append(onReadingRow);

  kanjiRow.append(infoCol);
  kanjiInfoCol.append(kanjiRow);
  kanjiInWordDiv.append(kanjiInfoCol);
};
