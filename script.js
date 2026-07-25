const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";

let dogs = [];

const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");


function parseCSV(text){

    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;


    for(let i = 0; i < text.length; i++){

        const char = text[i];

        if(char === '"'){

            if(insideQuotes && text[i+1] === '"'){
                value += '"';
                i++;
            }
            else{
                insideQuotes = !insideQuotes;
            }

        }
        else if(char === "," && !insideQuotes){

            row.push(value);
            value = "";

        }
        else if((char === "\n" || char === "\r") && !insideQuotes){

            if(value || row.length){

                row.push(value);
                rows.push(row);

            }

            row = [];
            value = "";

        }
        else{

            value += char;

        }

    }


    if(value || row.length){
        row.push(value);
        rows.push(row);
    }


    return rows;

}



async function loadDogs(){

    const response = await fetch(sheetURL);

    const csv = await response.text();

    const rows = parseCSV(csv);


    const headers = rows[0].map(h => h.trim());


    dogs = rows.slice(1)
    .map(row=>{

        let dog={};


        headers.forEach((header,index)=>{

            dog[header] =
            row[index]?.trim() || "";

        });


        return dog;

    });


    console.log("Dogs loaded:", dogs);


    displayDogs();

}



function displayDogs(){

    dogContainer.innerHTML="";


    const available =
    dogs.filter(dog =>
        dog.Status.toLowerCase() === "available"
    );


    dogCount.textContent =
    `${available.length} dog${available.length === 1 ? "" : "s"} available`;



    available.forEach(dog=>{


        const card=document.createElement("div");

        card.className="dog-card";


        card.innerHTML=`

        <img src="${dog.Photo}" alt="${dog.Name}">

        <h2>${dog.Name}</h2>

        <p>${dog.Breed}</p>

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


        dogContainer.appendChild(card);

    });

}


loadDogs();
