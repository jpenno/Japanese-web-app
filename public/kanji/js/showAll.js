// load jquery
var script = document.createElement("script");
script.src = "//code.jquery.com/jquery-1.11.0.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

document.addEventListener("DOMContentLoaded", e => {
  displayKanji();
});

// clear search results function
document.getElementById("clear-search-button").addEventListener("click", e => {
  // reset results container
  $("#results-container").empty();
  document.getElementById("search-input").value = "";
});

// search function
document.getElementById("search-button").addEventListener("click", async e => {
  // Prevent actual submit
  e.preventDefault();
  // reset results container
  $("#results-container").empty();
  // get the user search data
  const search = document.getElementById("search-input").value;
  // check if the user enter data
  if (search.length > 0) {
    const searchResults = await GetSearchResults(search);
    console.log(searchResults);
    if (searchResults.length > 0) {
      // if results table exists make results table
      const searchList = document.getElementById("results-container");
      const div = document.createElement("div");
      div.id = "results";

      div.innerHTML = `
      <h2 id='result-heading'>Results</h2>
      <table id='results-table' class="table table-striped mt-5">
        <thead>
          <tr>
            <th scope="col">Kanji</th>
            <th scope="col">Meaning</th>
          </tr>
        </thead>
        <tbody id="search-results">
        </tbody>
      </table>`;
      // add the search results div
      searchList.appendChild(div);

      buildTable(searchResults, "search-results");
    } else {
      // make a button to take you to add kanji page
      const addKanjiBtn = document.createElement("div");
      addKanjiBtn.innerHTML = `
      <div id="add-kanji-button-div">
        <button type="button" id="add-kanji-button" class="btn btn-info">
          Add Kanji
        </button>
      </div>`;
      // add button to page
      document.getElementById("results-container").appendChild(addKanjiBtn);

      $("#add-kanji-button").click(() => {
        // when kanji button clicked go to add kanji page
        window.location.href = "../html/add.html";
      });
    }
  }
});

// display Kanji
async function displayKanji() {
  const data = await GetKanji();
  buildTable(data, "kanji-list");
}

async function GetSearchResults(search) {
  // get search results
  const kanjis = await GetKanji();
  const searchResults = kanjis.filter(kanji => {
    if (kanji.character === search) {
      return kanji;
    }
  });

  return searchResults;
}

// Get kanji from database
async function GetKanji() {
  const res = await fetch("/kanji", { method: "get" });
  const data = await res.json();
  return data;
}

// build the table that displays the kanji
const buildTable = (list, element) => {
  list.forEach(i => {
    const ids = buildIDS(i);
    const list = document.getElementById(element);
    list.appendChild(buildRow(i, ids));
    kanjiInfo(i, ids);
    deleteKanji(i, ids);
  });
};

// build a row for the table
const buildRow = (kanji, ids) => {
  const row = document.createElement("tr");
  row.id = `${ids.rowID}`;
  row.innerHTML = `
  <td>${kanji.character}</td>
  <td>${kanji.meaning}</td>
  <td>
    <button type="button" class="btn btn-info" id="${ids.infoID}">Info</button>
  </td>
  <td>
    <button type="button" class="btn btn-danger" id="${ids.deleteID}">Delete</button>
  </td>
  `;

  return row;
};

// set up info button
const kanjiInfo = (kanji, ids) => {
  const infoBtn = $(`#${ids.infoID}`);
  infoBtn.click(() => {
    console.log("show kanji info");
    window.location.href = "../html/kanji-info-page.html" + "#" + kanji._id;
  });
};

// set up the delete button
const deleteKanji = (kanji, ids) => {
  const deleteBtn = $(`#${ids.deleteID}`);
  deleteBtn.click(() => {
    fetch(`/kanji/${kanji._id}`, {
      method: "delete"
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.ok == 1) {
          $(`#${ids.rowID}`).remove();
        }
      });
  });
};

const buildIDS = kanji => {
  return {
    rowID: `row-${kanji._id}`,
    infoID: `info-${kanji._id}`,
    deleteID: `delete-${kanji._id}`
  };
};
