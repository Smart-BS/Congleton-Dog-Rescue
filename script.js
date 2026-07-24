const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";
let dogs = [];
const dogContainer = document.getElementById("dogContainer");const dogCount = document.getElementById("dogCount");
const filters = ["breed","size","age","sex","energy","children","dogs","cats"];

async function loadDogs() {
    const response = await fetch(sheetURL);    const csv = await response.text();
    const lines = csv.split("\n");
    const headers = lines[0]        .split(",")        .map(x => x.trim());

    dogs = lines.slice(1)        .filter(x => x.trim() !== "")        .map(line => {
            const values = line.split(",");
            let dog = {};
            headers.forEach((header, index) => {                dog[header] = values[index] ? values[index].trim() : "";            });
            return dog;
        });

    console.log("Loaded dogs:", dogs);
    createBreedList();
    displayDogs();
}


function createBreedList() {
    const breed =    document.getElementById("breed");

    [...new Set(dogs.map(d => d.Breed))]    .filter(Boolean)    .forEach(item => {
        let option =        document.createElement("option");
        option.value = item;        option.textContent = item;
        breed.appendChild(option);
    });
}


function displayDogs() {
    dogContainer.innerHTML = "";
    let availableDogs = dogs.filter(dog => {
        return !dog.Status ||        dog.Status.toLowerCase() === "available";
    });

    dogCount.textContent =    availableDogs.length + " dogs available";

    availableDogs.forEach(dog => {

        let card =        document.createElement("div");

        card.className = "dog-card";

        card.innerHTML = `        <img src="${dog.Photo || ""}">        <div class="dog-info">        <h2>${dog.Name}</h2>        <p>${dog.Breed}</p>        <span class="tag">${dog.Size}</span>        <span class="tag">${dog.Age}</span>        <span class="tag">${dog.Sex}</span>        <p>        Energy: ${dog.Energy}<br>        Children: ${dog.Children}<br>        Dogs: ${dog.Dogs}<br>        Cats: ${dog.Cats}        </p>        </div>        `;

        dogContainer.appendChild(card);
    });
}


filters.forEach(filter => {
    document    .getElementById(filter)    .addEventListener("change", displayDogs);
});

loadDogs();
