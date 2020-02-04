$(document).ready(async () => {
  // hid search results table
  const resultsTable = $("#results-container");
  resultsTable.hide();

  // set up table to show all vocab
  const vocab = await getAllVocab();
  const table = $("#word-list");
  buildTable(vocab, table);

  // set up search for word
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

const buildTable = (vocab, table) => {
  vocab.forEach(item => {
    const row = buildRow(item);
    table.append(row);
  });
};

const buildRow = vocab => {
  const ids = buildIDS(vocab);
  const tRow = $("<tr>");
  tRow.attr("id", ids.rowID);
  // add word to row
  const wordCell = $("<td>").html(vocab.word);
  tRow.append(wordCell);
  // add meaning to row
  const meaningCell = $("<td>").html(vocab.meaning);
  tRow.append(meaningCell);

  // set up info button
  const infoCell = $("<td>");
  infoCell.append(
    buildBtn(vocab, ids.infoID, "Info", "btn-info", infoBtnClick)
  );
  tRow.append(infoCell);

  // set up delete button
  const deleteCell = $("<td>");
  deleteCell.append(
    buildBtn(
      vocab,
      { deleteID: ids.deleteID, rowID: ids.rowID },
      "Delete",
      "btn-danger",
      deleteBtnClick
    )
  );
  tRow.append(deleteCell);
  return tRow;
};

const buildBtn = (vocab, btnID, btnText, btnClass, onClick) => {
  const btn = $("<button>");
  btn.attr("id", btnID);
  btn.addClass("btn");
  btn.addClass(btnClass);
  btn.html(btnText);
  btn.click(() => {
    onClick(vocab, btnID);
  });
  return btn;
};

const deleteBtnClick = async (vocab, ids) => {
  const deleted = await deleteVocab(vocab);
  console.log("ids.rowID", ids.rowID);
  if (deleted) {
    $(`#${ids.rowID}`).remove();
  }
};

const infoBtnClick = vocab => {
  window.location.href = "../html/vocab-info-page.html" + "#" + vocab._id;
};

const buildIDS = vocab => {
  return {
    rowID: `row-${vocab._id}`,
    infoID: `info-${vocab._id}`,
    deleteID: `delete-${vocab._id}`
  };
};

async function getSearchResult(search) {
  const res = await fetch(`/vocab/getVocab/${search}`, { method: "get" });
  const data = await res.json();
  return data;
}

async function getAllVocab() {
  const res = await fetch("/vocab", { method: "get" });
  const data = await res.json();
  return data;
}

async function deleteVocab(vocab, ids) {
  const res = await fetch(`/vocab/${vocab._id}`, { method: "delete" });
  const data = await res.json();
  if (data.ok == 1) {
    return true;
  } else {
    return false;
  }
}
