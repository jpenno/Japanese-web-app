$(document).ready(async () => {
  // hid search results table
  const resultsTable = $("#results-container");
  resultsTable.hide();

  // set up table to show all kanji
  const kanji = await getAllKanji();
  const table = $("#kanji-list");
  buildTable(kanji, table);

  // set up search for kanji
  const search = $("#search-input");
  const searchBtn = $("#search-button");
  searchBtn.click(async () => {
    const searchResult = await getSearchResult(search.val());
    const searchTable = $("#search-results");
    searchTable.empty();
    buildTable(searchResult, searchTable);
    resultsTable.show();
  });

  // set up clear search btn
  const clearSearchBtn = $("#clear-search-button");
  clearSearchBtn.click(() => {
    $("#search-results").empty();
    resultsTable.hide();
  });
});

const buildTable = (kanji, table) => {
  kanji.forEach(item => {
    const row = buildRow(item);
    table.append(row);
  });
};

const buildRow = kanji => {
  const ids = buildIDS(kanji);
  const tRow = $("<tr>");
  tRow.attr("id", ids.rowID);
  // add word to row
  const wordCell = $("<td>").html(kanji.character);
  tRow.append(wordCell);
  // add meaning to row
  const meaningCell = $("<td>").html(kanji.meaning);
  tRow.append(meaningCell);

  // set up info button
  const infoCell = $("<td>");
  infoCell.append(
    buildBtn(kanji, ids.infoID, "Info", "btn-info", infoBtnClick)
  );
  tRow.append(infoCell);

  // set up delete button
  const deleteCell = $("<td>");
  deleteCell.append(
    buildBtn(
      kanji,
      { deleteID: ids.deleteID, rowID: ids.rowID },
      "Delete",
      "btn-danger",
      deleteBtnClick
    )
  );
  tRow.append(deleteCell);
  return tRow;
};

const buildBtn = (kanji, btnID, btnText, btnClass, onClick) => {
  const btn = $("<button>");
  btn.attr("id", btnID);
  btn.addClass("btn");
  btn.addClass(btnClass);
  btn.html(btnText);
  btn.click(() => {
    onClick(kanji, btnID);
  });
  return btn;
};

const deleteBtnClick = async (kanji, ids) => {
  const deleted = await deleteKanji(kanji);
  console.log("ids.rowID", ids.rowID);
  if (deleted) {
    $(`#${ids.rowID}`).remove();
  }
};

const infoBtnClick = kanji => {
  window.location.href = "../html/kanji-info-page.html" + "#" + kanji._id;
};

const buildIDS = kanji => {
  return {
    rowID: `row-${kanji._id}`,
    infoID: `info-${kanji._id}`,
    deleteID: `delete-${kanji._id}`
  };
};

async function getSearchResult(search) {
  const res = await fetch(`/kanji/getkanji/${search}`, { method: "get" });
  const data = await res.json();
  console.log('data', data);
  return data;
}

async function getAllKanji() {
  const res = await fetch("/kanji", { method: "get" });
  const data = await res.json();
  return data;
}

async function deleteKanji(kanji) {
  const res = await fetch(`/kanji/${kanji._id}`, { method: "delete" });
  const data = await res.json();
  if (data.ok == 1) {
    return true;
  } else {
    return false;
  }
}