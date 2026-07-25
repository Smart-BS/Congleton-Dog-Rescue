const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";


let dogs = [];


const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");



async function loadDogs(){


    const response = await fetch(sheetURL);

    const csv = await response.text();


    const rows = csv
        .split("\n")
        .map(row => row.split(","));


    const headers = rows[0].map(h => h.trim());



    dogs = rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {


            let dog = {};


            headers.forEach((header,index)=>{

                dog[header] =
                row[index]?.replace(/"/g,"").trim() || "";

            });


            return dog;


        });



    console.log("Dogs loaded:", dogs);


    populateBreedFilter();


    displayDogs(dogs);


}




function populateBreedFilter(){


    const breedSelect =
    document.getElementById("breed");


    const breeds =
    [...new Set(
        dogs.map(dog=>dog.Breed)
    )];


    breeds.forEach(breed=>{


        const option =
        document.createElement("option");


        option.value = breed;

        option.textContent = breed;


        breedSelect.appendChild(option);


    });


}




function displayDogs(list){


    dogContainer.innerHTML="";



    dogCount.textContent =
    `${list.length} dog${list.length === 1 ? "" : "s"} available`;



    list.forEach(dog=>{


        const card =
        document.createElement("div");


        card.className="dog-card";



        card.innerHTML=`

        <div class="photo-box">

            <img src="${dog.Photo}" alt="${dog.Name}">

        </div>


        <div class="dog-info">


            <h2>${dog.Name}</h2>

            <h3>${dog.Breed}</h3>


            <div class="badges">

                <span class="badge">🐾 ${dog.Size}</span>

                <span class="badge">🐾 ${dog.Age}</span>

                <span class="badge">🐾 ${dog.Sex}</span>

                <span class="badge">🐾 ${dog.Energy} energy</span>

            </div>


            <button class="meet-button">

                Meet ${dog.Name}

            </button>


        </div>

        `;



        card.querySelector(".meet-button")
        .onclick = function(){

            openProfile(dog);

        };



        dogContainer.appendChild(card);



    });


}





function openProfile(dog){



    const modal =
    document.getElementById("profileModal");


    const content =
    document.getElementById("profileContent");



    content.innerHTML = `


    <img src="${dog.Photo}" alt="${dog.Name}">


    <h2>${dog.Name}</h2>

    <h3>${dog.Breed}</h3>


    <h3>Description</h3>

    <p>
    ${dog.Description}
    </p>



    <h3>Personality</h3>

    <p>
    ${dog.Personality}
    </p>



    <h3>Ideal Home</h3>

    <p>
    ${dog.IdealHome}
    </p>



    <h3>Good With</h3>

    <p>
    Children: ${dog.Children}<br>
    Dogs: ${dog.Dogs}<br>
    Cats: ${dog.Cats}
    </p>


    `;



    modal.style.display="block";


}




document.querySelector(".close")
.onclick=function(){

    document.getElementById("profileModal")
    .style.display="none";

};





window.onclick=function(event){


    const modal =
    document.getElementById("profileModal");


    if(event.target === modal){

        modal.style.display="none";

    }


};





function filterDogs(){


    const breed =
    document.getElementById("breed").value;


    const size =
    document.getElementById("size").value;


    const age =
    document.getElementById("age").value;


    const sex =
    document.getElementById("sex").value;


    const energy =
    document.getElementById("energy").value;


    const children =
    document.getElementById("children").value;


    const dogsFriendly =
    document.getElementById("dogs").value;


    const cats =
    document.getElementById("cats").value;




    const filtered =
    dogs.filter(dog=>{


        return (

            (!breed || dog.Breed === breed) &&

            (!size || dog.Size === size) &&

            (!age || dog.Age === age) &&

            (!sex || dog.Sex === sex) &&

            (!energy || dog.Energy === energy) &&

            (!children || dog.Children === children) &&

            (!dogsFriendly || dog.Dogs === dogsFriendly) &&

            (!cats || dog.Cats === cats)

        );


    });



    displayDogs(filtered);


}




function clearFilters(){


    document.querySelectorAll("select")
    .forEach(select=>{

        select.value="";

    });


    displayDogs(dogs);


}





document.querySelectorAll("select")
.forEach(select=>{


    select.addEventListener(
        "change",
        filterDogs
    );


});




loadDogs();
