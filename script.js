const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";
let dogs = [];
const dogContainer = document.getElementById("dogContainer");const dogCount = document.getElementById("dogCount");

async function loadDogs() {
    const response = await fetch(sheetURL);    const csv = await response.text();
    const rows = csv.split("\n");
    const headers = rows[0].split(",");

    dogs = rows.slice(1)        .filter(row => row.trim() !== "")        .map(row => {
            const values = row.split(",");
            let dog = {};
            headers.forEach((header, index) => {
                dog[header.trim()] =                values[index]?.trim() || "";
            });
            return dog;
        });

    console.log("Dogs loaded:", dogs);
    showDogs();
}


function showDogs() {
    dogContainer.innerHTML = "";

    const availableDogs = dogs.filter(dog =>        dog.Status.toLowerCase() === "available"    );

    dogCount.textContent =    `${availableDogs.length} dog${availableDogs.length === 1 ? "" : "s"} available`;

    availableDogs.forEach(dog => {

        const card = document.createElement("div");
        card.className = "dog-card";

        card.innerHTML = `
        <img src="${dog.Photo}" alt="${dog.Name}">
        <div class="dog-info">
        <h2>${dog.Name}</h2>
        <p>${dog.Breed}</p>
        <span class="tag">${dog.Size}</span>
        <span class="tag">${dog.Age}</span>
        <span class="tag">${dog.Sex}</span>
        <br>
        <span class="tag">        Energy: ${dog.Energy}        </span>
        <span class="tag">        Children: ${dog.Children}        </span>
        <span class="tag">        Dogs: ${dog.Dogs}        </span>
        <span class="tag">        Cats: ${dog.Cats}        </span>

        </div>
        `;

        dogContainer.appendChild(card);

    });
}


loadDogs();
