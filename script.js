const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";
let dogs = [];
const filters = [  "breed",  "size",  "age",  "sex",  "energy",  "children",  "dogs",  "cats"];
const dogContainer = document.getElementById("dogContainer");const dogCount = document.getElementById("dogCount");

// Load Google Sheet
async function loadDogs() {
  try {
    const response = await fetch(sheetURL);
    const csv = await response.text();
    const rows = csv      .split(/\r?\n/)      .filter(row => row.trim() !== "");

    const headers = parseCSVRow(rows[0]);

    dogs = rows.slice(1).map(row => {
      const values = parseCSVRow(row);
      let dog = {};
      headers.forEach((header, index) => {
        dog[header.trim()] =          (values[index] || "").trim();
      });
      return dog;
    });

    console.log("Dogs loaded:", dogs);

    populateBreeds();
    displayDogs();

  } catch(error) {
    console.error("Loading error:", error);
    dogContainer.innerHTML =    "<p>Unable to load dogs.</p>";
  }
}


// Better CSV handling
function parseCSVRow(row) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for(let i = 0; i < row.length; i++) {
    const char =
