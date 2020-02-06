$(document).ready(async () => {
  // hid search results table
  const resultsElement = $("#results-container");
  resultsElement.hide();
  const vocab = await getAllVocab();

  // build rowIDS
  const rowIDS = vocab.map(word => {
    return `row-${word._id}`;
  });

  const data = buildTableData(vocab, rowIDS);

  const columns = ["Word", "Meaning", "Info", "Delete"];

  wordTable = new Table($("#test-table"), columns, data, rowIDS);
  wordTable.BuildTableTest();

  // set up search for word
  const search = $("#search-input");
  const searchBtn = $("#search-button");
  searchBtn.click(async () => {
    const searchResult = await getSearchResult(search.val());
    const searchTable = $("#search-results");
    searchTable.empty();

    const searchRowIDS = searchResult.map(word => {
      return `result-row-${word._id}`;
    });
    const data = buildTableData(searchResult, searchRowIDS);

    const resultTable = new Table(
      $("#search-results"),
      columns,
      data,
      searchRowIDS
    );
    resultTable.BuildTableTest();

    resultsElement.show();
  });

  // set up clear search btn
  const clearSearchBtn = $("#clear-search-button");
  clearSearchBtn.click(() => {
    $("#search-results").empty();
    resultsElement.hide();
  });
});

const buildTableData = (data, searchRowIDS) =>{
  return data.map((item, i) => {
    let values = Object.values(item);
    values = values.slice(1, 3);
    const infoBtn = new Button("btn btn-info", "info", infoBtnClick, {
      vocabID: item._id
    });
    values.push(infoBtn);

    const deleteBtn = new Button(
      "btn btn-danger",
      "Delete",
      deleteBtnClick,
      {
        vocabID: item._id,
        rowID: searchRowIDS[i]
      }
    );
    values.push(deleteBtn);

    return values;
  });
}

const deleteBtnClick = async btnData => {
  const deleted = await deleteVocab(btnData.vocabID);
  console.log("btnData.rowID", btnData.rowID);
  if (deleted) {
    $(`#${btnData.rowID}`).remove();
  }
};

const infoBtnClick = btnData => {
  window.location.href = "../html/vocab-info-page.html" + "#" + btnData.vocabID;
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

async function deleteVocab(vocabID) {
  const res = await fetch(`/vocab/${vocabID}`, { method: "delete" });
  const data = await res.json();
  if (data.ok == 1) {
    return true;
  } else {
    return false;
  }
}