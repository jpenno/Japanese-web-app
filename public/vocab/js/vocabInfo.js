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
  const word = $("#word");
  word.html(vocab.word);
  word.attr("href", vocab.jisyoLink);
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
  kanjiInfoCol = $("#kanji-in-word");

  const kanjiRow = $("<div>");
  kanjiRow.addClass("row ");

  const wordCol = $("<div>");
  wordCol.addClass("col-2 mt-3 kanjiColl");

  const word = $("<a>");
  word.attr("href", kanji.jisyoLink);
  word.attr("target", "_blank");
  word.addClass("kanji");
  word.html(kanji.character);

  wordCol.append(word);
  kanjiRow.append(wordCol);

  const infoCol = $("<div>");
  infoCol.addClass("col-8 mt-3");

  const meaningRow = $("<div>");
  meaningRow.addClass("row");
  meaningRow.addClass("kanjiMeanings");
  meaningRow.addClass("text-info");

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
};
