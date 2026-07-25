const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";

let dogs = [];

const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");


// Simple CSV parser
function parseCSV(text) {

    const lines = text.split(/\r?\n/);

    return lines.map(line => {

        const result = [];
        let current = "";
        let quote = false;


        for (let i = 0; i < line.length; i++) {

            const char = line[i];

            if (char === '"') {
                quote = !quote;
            }
            else if (char === "," && !quote) {

                result.push(current);
                current = "";

            }
            else {

                current += char;

            }

        }

        result.push(current);

        return result;

    });

}



async function loadDogs() {

    const response = await fetch(sheetURL);

    const csv = await response.text();


    const rows = parseCSV(csv);


    const headers = rows[0].map(h => h.trim());


    dogs = rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {

            let dog = {};

            headers.forEach((header,index)=>{

                dog[header] = row[index]?.trim() || "";

            });


            return dog;

        });


    console.log("Dogs loaded:", dogs);

    displayDogs();

}




function displayDogs() {


    dogContainer.innerHTML = "";


    const availableDogs = dogs.filter(dog =>
        dog.Status.toLowerCase() === "available"
    );


    dogCount.textContent =
    `${availableDogs.length} dog${availableDogs.length === 1 ? "" : "s"} available`;



    availableDogs.forEach(dog => {


        console.log("Creating card for:", dog.Name);
        console.log("Photo:", dog.Photo);



        const card = document.createElement("div");

        card.className = "dog-card";



        const img = document.createElement("img");

        img.src = dog.Photo;

        img.alt = dog.Name;


        img.onerror = () => {

            img.src = "https://via.placeholder.com/400x260?text=No+Photo";

        };



        const info = document.createElement("div");

        info.className = "dog-info";


        info.innerHTML = `

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

        `;


        card.appendChild(img);

        card.appendChild(info);


        dogContainer.appendChild(card);


    });

}



loadDogs();
