document.addEventListener("DOMContentLoaded", e => {
  Store.GetKanji();
});

// clear search results function
document.getElementById("clear-search-button").addEventListener("click", e => {
  // remove search results div
  document.getElementById("results").remove();
});

// search function
document.getElementById("search-button").addEventListener("click", e => {
  // Prevent actual submit
  e.preventDefault();
  // get the user search data
  const search = document.getElementById("search-input").value;
  const kanjis = Store.GetKanji();

  // get search results
  const searchResults = kanjis.filter(kanji => {
    if (kanji.character === search) {
      return kanji;
    }
  });

  // check is results table exists
  if (!document.getElementById("results")) {
    // if results table exists make results table
    const searchList = document.getElementById("results-container");
    const div = document.createElement("div");
    div.id = "results";

    div.innerHTML = `
      <h2 id='resulte-heading'>Results</h2>
      <table id='resultes-table' class="table table-striped mt-5">
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

  // show search results
  searchResults.forEach(kanji => {
    const list = document.getElementById("search-results");
    const row = document.createElement("tr");
    // make the row to add to results
    row.innerHTML = `
      <td>${kanji.character}</td>
      <td>${kanji.meaning}</td>
      `;

    // add row to table
    list.appendChild(row);
  });
});

// display Kanji
const displayKanji = data =>{
  data.forEach(kanji => {
    const list = document.getElementById("kanji-list");
    const row = document.createElement("tr");
    
    row.innerHTML = `
    <td>${kanji.character}</td>
    <td>${kanji.meaning}</td>
    `;
    // add table to page
    list.appendChild(row);
  })
};


// Store Class: Handle Storage
class Store {
  static GetKanji() {
    fetch("/getKanji", { method: "get" })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayKanji(data);
    });
  }

  // save kanji to local storage
  static addkanji(kanji) {
    const kanjis = Store.GetKanji();
    kanjis.push(kanji);
    localStorage.setItem("kanjis", JSON.stringify(kanjis));
  }
}


// Kanji class
class Kanji {
  constructor(character, meaning) {
    this.character = character;
    this.meaning = meaning;
  }
}
