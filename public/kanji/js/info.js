// load jquery
var script = document.createElement("script");
script.src = "//code.jquery.com/jquery-1.11.0.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

var infoKanjiID = window.location.hash.substring(1);

// get kanji 
async function getKanji() {
  const res = await fetch(`/kanji/${infoKanjiID}`, { method: "get" });
  //const res = await fetch(`/kanji`, { method: "get" });
  const data = await res.json();
  return data[0];
}

$(document).ready(async () => {

  const kanjiInfo = await getKanji();

  // set the character
  const character = $('#character');
  character.html(kanjiInfo.character);
  character.attr("href", kanjiInfo.jisyoLink);

  // set the meaning
  const meaning = $('#meaning');
  meaning.html(kanjiInfo.meaning);

  // set the kun reading
  const kunReading = $('#kunreading');
  kunReading.html(kanjiInfo.kunReading);

  //set the on reading
  const onReading = $('#onreading');
  onReading.html(kanjiInfo.onReading);
});