$(document).ready(async () => {
  // hid search results table
  const resultsTable = $("#results-container");
  resultsTable.hide();

  const kanji = await getAllKanji();
  const columns = ["Kanji", "Meaning", "Info", "Delete"];
  const rowIDS = Table.buildRowIDS("row", kanji);
  const data = buildTableData(kanji, rowIDS);

  const kanjiTable = new Table($("#test-table"), columns, data, rowIDS);
  kanjiTable.BuildTableTest();

  // set up search for kanji
  const search = $("#search-input");
  const searchBtn = $("#search-button");
  searchBtn.click(async () => {
    const searchResult = await getSearchResult(search.val());
    const searchTable = $("#search-results");
    searchTable.empty();
    const searchRowIDS = Table.buildRowIDS("search-row", searchResult);
    const data = buildTableData(searchResult, searchRowIDS);

    const searchResultsTable = new Table(
      $("#search-table"),
      columns,
      data,
      searchRowIDS
    );
    searchResultsTable.BuildTableTest();

    resultsTable.show();
  });

  // set up clear search btn
  const clearSearchBtn = $("#clear-search-button");
  clearSearchBtn.click(() => {
    $("#search-results").empty();
    resultsTable.hide();
  });
});

const buildTableData = (data, searchRowIDS) => {
  return data.map((item, i) => {
    console.log('searchRowIDS', searchRowIDS[i]);
    let values = Object.values(item);
    values = values.slice(1, 3);
    const infoBtn = new Button("btn btn-info", "info", infoBtnClick, {
      vocabID: item._id
    });
    values.push(infoBtn);

    const deleteBtn = new Button("btn btn-danger", "Delete", deleteBtnClick, {
      kanjiID: item._id,
      rowID: searchRowIDS[i]
    });
    values.push(deleteBtn);

    return values;
  });
};

const deleteBtnClick = async (btnData) => {
  const deleted = await deleteKanji(btnData.kanjiID);
  console.log("ids.rowID", btnData.rowID);
  if (deleted) {
    $(`#${btnData.rowID}`).remove();
  }
};

const infoBtnClick = btnData => {
  window.location.href = "../html/kanji-info-page.html" + "#" + btnData.vocabID;
};

async function getSearchResult(search) {
  const res = await fetch(`/kanji/getkanji/${search}`, { method: "get" });
  const data = await res.json();
  console.log("data", data);
  return data;
}

async function getAllKanji() {
  const res = await fetch("/kanji", { method: "get" });
  const data = await res.json();
  return data;
}

async function deleteKanji(id) {
  const res = await fetch(`/kanji/${id}`, { method: "delete" });
  const data = await res.json();
  if (data.ok == 1) {
    return true;
  } else {
    return false;
  }
}
