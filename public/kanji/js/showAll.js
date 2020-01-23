// load jquery
var script = document.createElement("script");
script.src = "//code.jquery.com/jquery-1.11.0.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

document.addEventListener("DOMContentLoaded", e => {
  displayKanji();
});

// clear search results function
document.getElementById("clear-search-button").addEventListener("click", e => {
  // remove search results div
  document.getElementById("results").remove();
  document.getElementById("search-input").value = "";
});

// search function
document.getElementById("search-button").addEventListener("click", e => {
  // Prevent actual submit
  e.preventDefault();

  // check is results table exists
  if (!document.getElementById("results")) {
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
  } else {
    // clear old search results
    document.getElementById("search-results").innerHTML = "";
  }
  // get the user search data
  const search = document.getElementById("search-input").value;

  showSearchResults(search);
});

// display Kanji
async function displayKanji() {
  const data = await GetKanji();
  buildTable(data, "kanji-list")
}

async function showSearchResults(search) {
  // get search results
  const kanjis = await GetKanji();
  const searchResults = kanjis.filter(kanji => {
    if (kanji.character === search) {
      return kanji;
    }
  });

  buildTable(searchResults, "search-results")
}

// Get kanji from database
async function GetKanji() {
  const res = await fetch("/kanji", { method: "get" });
  const data = await res.json();
  return data;
}

// Kanji class
class Kanji {
  constructor(character, meaning) {
    this.character = character;
    this.meaning = meaning;
  }
}

// build the table that displays the kanji
const buildTable = (list, element) =>{
  list.forEach(i => {
    const list = document.getElementById(element);
    list.appendChild(buildRow(i));
    deleteKanji(i);
  });
}

// build a row for the table
const buildRow = (kanji) =>{
  const row = document.createElement("tr");
  row.id = `row-${kanji._id}`
  row.innerHTML = `
  <td>${kanji.character}</td>
  <td>${kanji.meaning}</td>
  <td>
    <button type="button" class="btn btn-danger" id="${kanji._id}">Delete</button>
  </td>
  `;

  return row;
}

// set up the delete button
const deleteKanji = (kanji) => {
  let deleteBtn = $(`#${kanji._id}`);
  deleteBtn.click(() => {
    fetch(`/kanji/${kanji._id}`, {
      method: "delete"
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.ok == 1) {
          $(`#row-${kanji._id}`).remove();
        }
      });
  });
};