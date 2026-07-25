const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";

let dogs = [];

const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");


function parseCSV(text) {

    const lines = text.split(/\r?\n/);

    return lines.map(line => {

        const values = [];
        let current = "";
        let quotes = false;

        for (let char of line) {

            if (char === '"') {

                quotes = !quotes;

            } else if (char === "," && !quotes) {

                values.push(current);
                current = "";

            } else {

                current += char;

            }

        }

        values.push(current);

        return values;

    });

}



async function loadDogs() {

    const response = await fetch(sheetURL);

    const csv = await response.text();

    const rows = parseCSV(csv);

    const headers = rows[0].map(x => x.trim());


    dogs = rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {

            let dog = {};

            headers.forEach((header,index)=>{

                dog[header] = row[index]?.trim() || "";

            });

            return dog;

        });


    console.log(dogs);

    displayDogs();

}



function displayDogs(){

    dogContainer.innerHTML = "";


    const availableDogs = dogs.filter(dog =>
        dog.Status.toLowerCase() === "available"
    );


    dogCount.textContent =
    `${availableDogs.length} dog${availableDogs.length === 1 ? "" : "s"} available`;



    availableDogs.forEach(dog => {


        const card = document.createElement("div");

        card.className = "dog-card";


        card.innerHTML = `

        <div class="photo-box">
            <img src="${dog.Photo}" alt="${dog.Name}">
        </div>


        <div class="dog-info">

            <h2>${dog.Name}</h2>

            <h3>${dog.Breed}</h3>

            <p>
            ${dog.Size} |
            ${dog.Age} |
            ${dog.Sex}
            </p>

            <p>
            Energy: ${dog.Energy}<br>
            Good with children: ${dog.Children}<br>
            Good with dogs: ${dog.Dogs}<br>
            Good with cats: ${dog.Cats}
            </p>

        </div>

        `;


        const image =
        card.querySelector("img");


        image.onerror = function(){

            this.style.display = "none";

            this.parentElement.innerHTML =
            "<strong>Photo coming soon</strong>";

        };


        dogContainer.appendChild(card);


    });

}


loadDogs();
