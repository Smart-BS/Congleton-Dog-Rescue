const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";

let dogs = [];

const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");


// Convert Google Drive links
function convertGoogleDriveImage(url){

    if(!url){
        return "";
    }

    if(url.includes("drive.google.com/file/d/")){

        const id = url
            .split("/d/")[1]
            .split("/")[0];

        return `https://drive.google.com/uc?export=view&id=${id}`;

    }

    return url;

}


// CSV parser
function parseCSV(text){

    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;


    for(let char of text){

        if(char === '"'){

            insideQuotes = !insideQuotes;

        } else if(char === "," && !insideQuotes){

            row.push(value);
            value = "";

        } else if((char === "\n" || char === "\r") && !insideQuotes){

            if(row.length || value){

                row.push(value);
                rows.push(row);

            }

            row = [];
            value = "";

        } else {

            value += char;

        }

    }


    if(row.length || value){

        row.push(value);
        rows.push(row);

    }


    return rows;

}



async function loadDogs(){

    const response = await fetch(sheetURL);

    const csv = await response.text();

    const rows = parseCSV(csv);


    const headers = rows[0]
        .map(header => header.trim());


    dogs = rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {

            let dog = {};


            headers.forEach((header,index)=>{

                let value = row[index]?.trim() || "";


                if(header === "Photo"){

                    value = convertGoogleDriveImage(value);

                }


                dog[header] = value;

            });


            return dog;

        });


    console.log("Dogs loaded:", dogs);

    displayDogs();

}




function displayDogs(){

    dogContainer.innerHTML = "";


    const availableDogs = dogs.filter(dog =>
        dog.Status.toLowerCase() === "available"
    );


    dogCount.textContent =
    `${availableDogs.length} dog${availableDogs.length === 1 ? "" : "s"} available`;



    availableDogs.forEach(dog=>{


        const card = document.createElement("div");

        card.className = "dog-card";


        const image = document.createElement("img");

        image.src = dog.Photo;

        image.alt = dog.Name;


        image.onerror = function(){

            this.src = "https://via.placeholder.com/400x260?text=Photo+Coming+Soon";

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


        card.appendChild(image);

        card.appendChild(info);


        dogContainer.appendChild(card);


    });

}



loadDogs();
