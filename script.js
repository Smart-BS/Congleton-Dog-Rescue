const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";
let dogs = [];
const dogContainer = document.getElementById("dogContainer");const dogCount = document.getElementById("dogCount");
const filters = [    "Breed",    "Size",    "Age",    "Sex",    "Energy",    "Children",    "Dogs",    "Cats"];

async function loadDogs(){
    const response = await fetch(sheetURL);
    const csv = await response.text();
    const rows = csv.split(/\r?\n/);
    const headers = rows[0]        .split("\t")        .map(h => h.trim());

    dogs = rows.slice(1)        .filter(row => row.trim())        .map(row => {
            const values = row.split("\t");
            let dog = {};
            headers.forEach((header,index)=>{                dog[header] =                values[index]?.trim() || "";            });
            return dog;
        });

    console.log("Dogs loaded:", dogs);
    displayDogs();
}


function displayDogs(){
    dogContainer.innerHTML="";

    const results = dogs.filter(dog=>{

        if(            dog.Status &&            dog.Status.toLowerCase() !== "available"        ){            return false;        }

        return filters.every(field=>{

            const select =            document.getElementById(field.toLowerCase());

            if(!select || select.value===""){                return true;            }

            return (                dog[field] || ""            )            .toLowerCase()            ===            select.value.toLowerCase();

        });

    });

    dogCount.textContent =    `${results.length} dog${results.length === 1 ? "" : "s"} available`;

    results.forEach(dog=>{

        const card=document.createElement("div");
        card.className="dog-card";

        card.innerHTML=`
        <img src="${dog.Photo || ""}">
        <h2>${dog.Name}</h2>
        <p>${dog.Breed}</p>
        <p>        ${dog.Size} |        ${dog.Age} |        ${dog.Sex}        </p>
        <p>        Energy: ${dog.Energy}<br>        Good with children: ${dog.Children}<br>        Good with dogs: ${dog.Dogs}<br>        Good with cats: ${dog.Cats}        </p>
        `;

        dogContainer.appendChild(card);

    });
}


filters.forEach(field=>{
    const element =    document.getElementById(field.toLowerCase());

    if(element){
        element.addEventListener(            "change",            displayDogs        );
    }
});

loadDogs();
